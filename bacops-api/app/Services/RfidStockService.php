<?php
// app/Services/RfidStockService.php

namespace App\Services;

use App\Exceptions\StockServiceException;
use App\Models\commandes_rfid;
use App\Models\RFID;
use App\Models\StockSummaryRFID;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;

class RfidStockService
{
    public function createRfidsStock(array $input, int $currentUserId): array
    {
        $prefix = trim($input['prefix']);
        $commentaire = $input['commentaire'] ?? null;

        $this->assertValid($prefix !== '', 'Le champ prefix ne doit pas être vide');
        $this->assertValid((bool) preg_match('/^[A-Za-z0-9]+$/', $prefix), 'Le champ prefix doit contenir uniquement des lettres et des chiffres');
        $this->assertValid(is_int($input['rfid_debut']) && $input['rfid_debut'] > 0, 'Le champ rfid_debut doit être un entier positif');
        $this->assertValid(is_int($input['rfid_fin']) && $input['rfid_fin'] > 0, 'Le champ rfid_fin doit être un entier positif');
        $this->assertValid($input['rfid_fin'] >= $input['rfid_debut'], 'Le champ rfid_fin doit être supérieur ou égal à rfid_debut');
        $this->assertValid(is_int($input['quantite']) && $input['quantite'] > 0, 'Le champ quantite doit être un entier positif');
        $this->assertValid(
            ($input['rfid_fin'] - $input['rfid_debut'] + 1) === $input['quantite'],
            'La quantité ne correspond pas à la plage de codes RFID'
        );

        $rfidCodes = [];
        for ($i = 0; $i < $input['quantite']; $i++) {
            $rfidCodes[] = $prefix . ($input['rfid_debut'] + $i);
        }

        $conflicts = RFID::whereIn('rfid_code', $rfidCodes)->pluck('rfid_code')->all();

        if (count($conflicts) > 0) {
            throw new StockServiceException('Les codes RFID suivants existent déjà', 409, $conflicts);
        }

        try {
            DB::transaction(function () use ($input, $commentaire, $currentUserId, $rfidCodes) {
                $commande = commandes_rfid::create([
                    'quantite' => $input['quantite'],
                    'commentaire' => $commentaire,
                    'added_by' => $currentUserId,
                ]);

                $now = now();
                $rows = array_map(fn ($code) => [
                    'rfid_code' => $code,
                    'status' => 'en_stock',
                    'added_by' => $currentUserId,
                    'commande_id' => $commande->id,
                    'created_at' => $now,
                    'updated_at' => $now,
                ], $rfidCodes);

                RFID::insert($rows);

                $summary = StockSummaryRFID::first();

                if ($summary) {
                    $summary->increment('total', $input['quantite']);
                    $summary->increment('disponible', $input['quantite']);
                } else {
                    StockSummaryRFID::create([
                        'total' => $input['quantite'],
                        'disponible' => $input['quantite'],
                        'en_service' => 0,
                        'perdu' => 0,
                    ]);
                }
            });
        } catch (QueryException $e) {
            // MySQL integrity constraint violation (duplicate rfid_code), analogous to Prisma's P2002
            if ($e->getCode() === '23000') {
                throw new StockServiceException('Les codes RFID suivants existent déjà', 409, $rfidCodes);
            }

            throw $e;
        }

        return [
            'message' => "{$input['quantite']} RFIDs ajoutés au stock avec succès",
            'quantite' => $input['quantite'],
            'range' => "{$prefix}{$input['rfid_debut']} → {$prefix}{$input['rfid_fin']}",
        ];
    }

    private function assertValid(bool $condition, string $message): void
    {
        if (!$condition) {
            throw new StockServiceException($message, 400);
        }
    }
}