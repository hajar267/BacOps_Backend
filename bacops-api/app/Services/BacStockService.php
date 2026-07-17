<?php
// app/Services/BacStockService.php

namespace App\Services;

use App\Exceptions\StockServiceException;
use App\Models\Bac;
use App\Models\BacType;
use App\Models\CadreCommande;
use App\Models\Commande;
use App\Models\StockSummaryBac;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;

class BacStockService
{
    public function createBacsStock(array $input, int $currentUserId): array
    {
        $prefix = trim($input['prefix']);
        $nature = trim($input['nature']);
        $capacite = trim($input['capacite']);
        $matiere = trim($input['matiere']);
        $color = trim($input['color']);
        $cadreCommandeLabel = trim($input['cadre_commande']);
        $fournisseur = trim($input['fournisseur']);
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
        $this->assertValid($cadreCommandeLabel !== '', 'Le champ cadre_commande ne doit pas être vide');
        $this->assertValid(is_int($input['quantite']) && $input['quantite'] > 0, 'Le champ quantite doit être un entier positif');
        $this->assertValid(
            ($input['numero_fin'] - $input['numero_debut'] + 1) === $input['quantite'],
            'La quantité ne correspond pas à la plage de numéros de série'
        );
        $this->assertValid(is_numeric($input['prix']) && $input['prix'] > 0, 'Le champ prix doit être un nombre positif');
        $this->assertValid($fournisseur !== '', 'Le champ fournisseur ne doit pas être vide');

        $bacType = BacType::where('nature', $nature)
            ->where('capacite', $capacite)
            ->where('matiere', $matiere)
            ->where('color', $color)
            ->first();

        if (!$bacType) {
            throw new StockServiceException('Type de bac introuvable pour cette combinaison nature/capacité/matière', 404);
        }

        $cadreCommande = CadreCommande::where('label', $cadreCommandeLabel)->first();

        if (!$cadreCommande) {
            throw new StockServiceException("Cadre de commande '{$cadreCommandeLabel}' introuvable", 404);
        }

        $serialNumbers = [];
        for ($i = 0; $i < $input['quantite']; $i++) {
            $serial = $input['numero_debut'] + $i;
            $serialNumbers[] = "{$prefix}-{$serial}";
        }

        $conflicts = Bac::whereIn('serial_number', $serialNumbers)->pluck('serial_number')->all();

        if (count($conflicts) > 0) {
            throw new StockServiceException('Les numéros de série suivants existent déjà', 409, $conflicts);
        }

        try {
            $result = DB::transaction(function () use (
                $cadreCommande, $currentUserId, $input, $fournisseur, $commentaire, $bacType, $serialNumbers
            ) {
                $commande = Commande::create([
                    'cadre_commande_id' => $cadreCommande->id,
                    'added_by' => $currentUserId,
                    'quantite' => $input['quantite'],
                    'price' => $input['prix'],
                    'fournisseur' => $fournisseur,
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
            'range' => "{$prefix}-{$input['numero_debut']} → {$prefix}-{$input['numero_fin']}",
        ];
    }

    private function assertValid(bool $condition, string $message): void
    {
        if (!$condition) {
            throw new StockServiceException($message, 400);
        }
    }
}