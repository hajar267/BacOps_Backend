<?php

namespace App\Services;

use App\Exceptions\BacTypeServiceException;
use App\Models\BacType;

class BacTypeService
{
    public function getAllBacTypes()
    {
        return BacType::orderBy('id', 'asc')->get();
    }

    public function getNatures(): array
    {
        return BacType::where('is_active', true)
            ->distinct()
            ->pluck('nature')
            ->values()
            ->all();
    }

    public function getCapacites(string $nature): array
    {
        return BacType::where('nature', $nature)
            ->where('is_active', true)
            ->distinct()
            ->pluck('capacite')
            ->filter()
            ->values()
            ->all();
    }

    public function getMatieres(string $nature, string $capacite): array
    {
        return BacType::where('nature', $nature)
            ->where('capacite', $capacite)
            ->where('is_active', true)
            ->distinct()
            ->pluck('matiere')
            ->filter()
            ->values()
            ->all();
    }

    public function getColors(string $nature, string $capacite, string $matiere): array
    {
        return BacType::where('nature', $nature)
            ->where('capacite', $capacite)
            ->where('matiere', $matiere)
            ->where('is_active', true)
            ->distinct()
            ->pluck('color')
            ->filter()
            ->values()
            ->all();
    }

    public function createBacType(array $input): BacType
    {
        $nature = trim($input['nature']);
        $capacite = $this->normalizeNullableText($input['capacite'] ?? null);
        $variante = $this->normalizeNullableText($input['variante'] ?? null);
        $matiere = $this->normalizeNullableText($input['matiere'] ?? null);
        $color = $this->normalizeNullableText($input['color'] ?? null);

        if ($nature === '') {
            throw new BacTypeServiceException('Le champ nature ne doit pas être vide', 400);
        }

        $existing = BacType::where('nature', $nature)
            ->where('capacite', $capacite)
            ->where('variante', $variante)
            ->where('matiere', $matiere)
            ->where('color', $color)
            ->first();

        if ($existing) {
            throw new BacTypeServiceException(
                'Ce type de bac existe déjà',
                409,
                [$nature, $capacite ?? '', $variante ?? '', $matiere ?? '', $color ?? '']
            );
        }

        return BacType::create([
            'nature' => $nature,
            'capacite' => $capacite,
            'variante' => $variante,
            'matiere' => $matiere,
            'color' => $color,
            'is_active' => true,
        ]);
    }

    private function normalizeNullableText(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $normalized = trim($value);

        if ($normalized === '') {
            throw new BacTypeServiceException('Les champs texte ne doivent pas être vides', 400);
        }

        return $normalized;
    }

    public function updateBacType(BacType $bacType, array $input): BacType
{
    $nature   = array_key_exists('nature', $input) ? trim($input['nature']) : $bacType->nature;
    $capacite = array_key_exists('capacite', $input) ? $this->normalizeNullableText($input['capacite']) : $bacType->capacite;
    $variante = array_key_exists('variante', $input) ? $this->normalizeNullableText($input['variante']) : $bacType->variante;
    $matiere  = array_key_exists('matiere', $input) ? $this->normalizeNullableText($input['matiere']) : $bacType->matiere;
    $color    = array_key_exists('color', $input) ? $this->normalizeNullableText($input['color']) : $bacType->color;

    if ($nature === '') {
        throw new BacTypeServiceException('Le champ nature ne doit pas être vide', 400);
    }

    $existing = BacType::where('nature', $nature)
        ->where('capacite', $capacite)
        ->where('variante', $variante)
        ->where('matiere', $matiere)
        ->where('color', $color)
        ->where('id', '!=', $bacType->id)
        ->first();

    if ($existing) {
        throw new BacTypeServiceException(
            'Ce type de bac existe déjà',
            409,
            [$nature, $capacite ?? '', $variante ?? '', $matiere ?? '', $color ?? '']
        );
    }

    $bacType->update([
        'nature' => $nature,
        'capacite' => $capacite,
        'variante' => $variante,
        'matiere' => $matiere,
        'color' => $color,
    ]);

    return $bacType;
}

}
