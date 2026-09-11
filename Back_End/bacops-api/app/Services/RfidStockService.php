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
        $commentaire = $input['commentaire'] ?? null;
        $rfidCodes = array_map(function ($code) {
            $code = strtoupper(trim((string) $code));
            $this->assertValid($code !== '', 'Chaque code RFID ne doit pas être vide');
            $this->assertValid((bool) preg_match('/^[0-9A-F]+$/', $code), 'Chaque code RFID doit être hexadecimal');

            return $code;
        }, $input['rfids']);

        $this->assertValid(count($rfidCodes) === count(array_unique($rfidCodes)), 'La liste contient des codes RFID en double');
        $quantite = count($rfidCodes);

        $conflicts = RFID::whereIn('rfid_code', $rfidCodes)->pluck('rfid_code')->all();

        if (count($conflicts) > 0) {
            throw new StockServiceException('Les codes RFID suivants existent déjà', 409, $conflicts);
        }

        try {
            DB::transaction(function () use ($commentaire, $currentUserId, $rfidCodes, $quantite) {
                $commande = commandes_rfid::create([
                    'quantite' => $quantite,
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
                    $summary->increment('total', $quantite);
                    $summary->increment('disponible', $quantite);
                } else {
                    StockSummaryRFID::create([
                        'total' => $quantite,
                        'disponible' => $quantite,
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
            'message' => "{$quantite} RFIDs ajoutés au stock avec succès",
            'quantite' => $quantite,
            'rfids' => $rfidCodes,
        ];
    }

    private function assertValid(bool $condition, string $message): void
    {
        if (!$condition) {
            throw new StockServiceException($message, 400);
        }
    }

    public function findRfidsByTags(array $tags): \Illuminate\Support\Collection
{
    if (empty($tags)) {
        return collect();
    }

    $rows = RFID::whereIn('rfid_code', $tags)
        ->get(['id', 'rfid_code', 'status', 'commande_id', 'added_by']);

    return $rows->keyBy('rfid_code');
}

public function isRfidAvailableForItem(?RFID $item): array
{
    if (!$item) {
        return ['identifier' => '', 'available' => false, 'status' => 'not_found', 'reason' => 'not_found', 'item' => null];
    }

    $status = $item->status ?? 'not_found';
    $available = $status === 'en_stock' || $status === 'disponible';
    $reason = null;

    if (!$available) {
        $reason = match ($status) {
            'en_service' => 'already_assigned',
            'perdu' => 'perdu',
            default => 'unavailable',
        };
    }

    return [
        'identifier' => $item->rfid_code,
        'available' => $available,
        'status' => $status,
        'reason' => $reason,
        'item' => $item,
    ];
}
}