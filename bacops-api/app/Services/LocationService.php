<?php

namespace App\Services;

use App\Models\Arrondissement;
use App\Models\PrefectureVille;

class LocationService
{
    public function getTree()
    {
        return PrefectureVille::with('arrondissements')
            ->orderBy('prefecture')
            ->orderBy('ville')
            ->get();
    }

    public function createArrondissement(array $data): Arrondissement
    {
        $pv = PrefectureVille::firstOrCreate(
            ['prefecture' => $data['prefecture'], 'ville' => $data['ville']]
        );

        return Arrondissement::create([
            'prefecture_ville_id' => $pv->id,
            'name' => $data['name'],
        ]);
    }

    public function updateArrondissement(int $id, array $data): Arrondissement
    {
        $arrondissement = Arrondissement::findOrFail($id);

        if (isset($data['prefecture']) || isset($data['ville'])) {
            $prefecture = $data['prefecture'] ?? $arrondissement->prefectureVille->prefecture;
            $ville = $data['ville'] ?? $arrondissement->prefectureVille->ville;

            $pv = PrefectureVille::firstOrCreate(
                ['prefecture' => $prefecture, 'ville' => $ville]
            );

            $arrondissement->prefecture_ville_id = $pv->id;
        }

        if (isset($data['name'])) {
            $arrondissement->name = $data['name'];
        }

        $arrondissement->save();

        return $arrondissement->load('prefectureVille');
    }

    public function deleteArrondissement(int $id): void
    {
        $arrondissement = Arrondissement::findOrFail($id);
        $arrondissement->delete();
    }
}
