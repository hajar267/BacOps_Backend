<?php
// app/Services/BacStockService.php

namespace App\Services;

use App\Exceptions\StockServiceException;
use App\Models\Bac;
use App\Models\BacType;
use App\Models\CadreCommande;
use App\Models\Commande;
use App\Models\StockSummaryBac;
use App\Models\Supplier;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;
use App\Models\BacHistoryEvent;

class BacStockService
{
    public function createBacsStock(array $input, int $currentUserId): array
    {
        $prefix = trim($input['prefix']);
        $nature = trim($input['nature']);
        $capacite = trim($input['capacite']);
        $matiere = trim($input['matiere']);
        $color = trim($input['color']);
        $cadreCommandeId = $input['cadre_commande_id'];
        $fournisseurId = $input['fournisseur_id'];
        $commentaire = $input['commentaire'] ?? null;

        $this->assertValid($prefix !== '', 'Le champ prefix ne doit pas être vide');
        $this->assertValid((bool) preg_match('/^[A-Za-z0-9]+$/', $prefix), 'Le champ prefix doit contenir uniquement des lettres et des chiffres');
        $this->assertValid(is_int($input['numero_debut']) && $input['numero_debut'] > 0, 'Le champ numero_debut doit être un entier positif');
        $this->assertValid(is_int($input['numero_fin']) && $input['numero_fin'] > 0, 'Le champ numero_fin doit être un entier positif');
        $this->assertValid($input['numero_fin'] >= $input['numero_debut'], 'Le champ numero_fin doit être supérieur ou égal à numero_debut');
        $this->assertValid($nature !== '', 'Le champ nature ne doit pas être vide');
        $this->assertValid($capacite !== '', 'Le champ capacite ne doit pas être vide');
        $this->assertValid($matiere !== '', 'Le champ matiere ne doit pas être vide');
        $this->assertValid($color !== '', 'Le champ color ne doit pas être vide');
        $this->assertValid(is_int($input['quantite']) && $input['quantite'] > 0, 'Le champ quantite doit être un entier positif');
        $this->assertValid(
            ($input['numero_fin'] - $input['numero_debut'] + 1) === $input['quantite'],
            'La quantité ne correspond pas à la plage de numéros de série'
        );
        $this->assertValid(is_numeric($input['prix']) && $input['prix'] > 0, 'Le champ prix doit être un nombre positif');

        $bacType = BacType::where('nature', $nature)
            ->where('capacite', $capacite)
            ->where('matiere', $matiere)
            ->where('color', $color)
            ->first();

        if (!$bacType) {
            throw new StockServiceException('Type de bac introuvable pour cette combinaison nature/capacité/matière', 404);
        }

        $cadreCommande = CadreCommande::find($cadreCommandeId);

        if (!$cadreCommande) {
            throw new StockServiceException('Cadre de commande introuvable', 404);
        }

        $fournisseur = Supplier::find($fournisseurId);

        if (!$fournisseur) {
            throw new StockServiceException('Fournisseur introuvable', 404);
        }

        $serialNumbers = [];
        for ($i = 0; $i < $input['quantite']; $i++) {
            $serial = $input['numero_debut'] + $i;
            $serialNumbers[] = "{$serial}-{$prefix}";
        }

        $conflicts = Bac::whereIn('serial_number', $serialNumbers)->pluck('serial_number')->all();

        if (count($conflicts) > 0) {
            throw new StockServiceException('Les numéros de série suivants existent déjà', 409, $conflicts);
        }

        try {
            $result = DB::transaction(function () use (
                $cadreCommande, $fournisseur, $currentUserId, $input, $commentaire, $bacType, $serialNumbers
            ) {
                $commande = Commande::create([
                    'cadre_commande_id' => $cadreCommande->id,
                    'fournisseur_id' => $fournisseur->id,
                    'added_by' => $currentUserId,
                    'quantite' => $input['quantite'],
                    'price' => $input['prix'],
                    'commentaire' => $commentaire,
                ]);

                $now = now();
                $rows = array_map(fn ($serial) => [
                    'serial_number' => $serial,
                    'status' => 'en_stock',
                    'bac_type_id' => $bacType->id,
                    'commande_id' => $commande->id,
                    'added_by' => $currentUserId,
                    'created_at' => $now,
                    'updated_at' => $now,
                ], $serialNumbers);

                Bac::insert($rows);

                $bacIds = Bac::whereIn('serial_number', $serialNumbers)->pluck('id', 'serial_number');

                $historyRows = array_map(fn ($serial) => [
                    'bac_id' => $bacIds[$serial],
                    'rfid_id' => null,
                    'installation_id' => null,
                    'action' => 'entree_stock',
                    'previous_state' => null,
                    'new_state' => 'en_stock',
                    'agent_id' => $currentUserId,
                    'occurred_at' => $now,
                    'created_at' => $now,
                    'updated_at' => $now,
                ], $serialNumbers);

                BacHistoryEvent::insert($historyRows);

                $summary = StockSummaryBac::where('bac_type_id', $bacType->id)->first();

                if ($summary) {
                    $summary->increment('total', $input['quantite']);
                    $summary->increment('en_stock', $input['quantite']);
                } else {
                    StockSummaryBac::create([
                        'bac_type_id' => $bacType->id,
                        'total' => $input['quantite'],
                        'en_stock' => $input['quantite'],
                        'en_service' => 0,
                        'en_reparation' => 0,
                        'perdu' => 0,
                        'mis_en_rebut' => 0,
                    ]);
                }
                return [
                    'commandeId' => $commande->id,
                    'bacTypeId' => $bacType->id,
                ];
            });
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                throw new StockServiceException('Les numéros de série suivants existent déjà', 409, $serialNumbers);
            }

            throw $e;
        }

        return [
            'message' => "{$input['quantite']} bacs ajoutés au stock avec succès",
            'commande_id' => $result['commandeId'],
            'bac_type_id' => $result['bacTypeId'],
            'quantite' => $input['quantite'],
            'range' => "{$input['numero_debut']}-{$prefix} → {$input['numero_fin']}-{$prefix}",
        ];
    }

private function assertValid(bool $condition, string $message): void
{
    if (!$condition) {
        throw new StockServiceException($message, 400);
    }
}

public function findBacTypeIdsBySiteInfo(array $siteInfo): array
{
    if (empty($siteInfo)) {
        return [];
    }

    if (!empty($siteInfo['allowedBacTypeIds']) && is_array($siteInfo['allowedBacTypeIds'])) {
        return $siteInfo['allowedBacTypeIds'];
    }

    $query = BacType::query();

    if (!empty($siteInfo['nature'])) {
        $query->where('nature', $siteInfo['nature']);
    }
    if (!empty($siteInfo['capacite'])) {
        $query->where('capacite', $siteInfo['capacite']);
    }
    if (!empty($siteInfo['matiere'])) {
        $query->where('matiere', $siteInfo['matiere']);
    }
    if (!empty($siteInfo['color'])) {
        $query->where('color', $siteInfo['color']);
    }
    if (!empty($siteInfo['variante'])) {
        $query->where('variante', $siteInfo['variante']);
    }

    return $query->pluck('id')->all();
}

public function findBacsBySerialsAndSite(array $serials, array $siteInfo): array
{
    $typeIds = $this->findBacTypeIdsBySiteInfo($siteInfo);

    if (empty($typeIds)) {
        return ['map' => collect(), 'typeIds' => $typeIds];
    }

    $bacs = Bac::whereIn('serial_number', $serials)
        ->whereIn('bac_type_id', $typeIds)
        ->get(['id', 'serial_number', 'status', 'bac_type_id', 'commande_id', 'added_by']);

    $map = $bacs->keyBy('serial_number');

    return ['map' => $map, 'typeIds' => $typeIds];
}

public function isBacAvailableForItem(?Bac $item): array
{
    if (!$item) {
        return ['identifier' => '', 'available' => false, 'status' => 'not_found', 'reason' => 'not_found', 'item' => null];
    }

    $status = $item->status ?? 'not_found';
    $available = $status === 'en_stock';
    $reason = null;

    if (!$available) {
        $reason = match ($status) {
            'en_service' => 'already_installed',
            'en_reparation' => 'in_repair',
            'perdu' => 'perdu',
            'mis_en_rebut' => 'mis_en_rebut',
            default => 'unavailable',
        };
    }

    return [
        'identifier' => $item->serial_number,
        'available' => $available,
        'status' => $status,
        'reason' => $reason,
        'item' => $item,
    ];
}
}
