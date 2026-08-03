<?php

namespace App\Services;

use App\Models\Arrondissement;
use App\Models\Ville;
use App\Models\Prefecture;

class LocationService
{
    public function getTree()
    {
        $villes = Ville::with('prefectures.arrondissements')->orderBy('name')->get();

        $result = collect();

        foreach ($villes as $ville) {
            foreach ($ville->prefectures as $pref) {
                $result->push((object) [
                    'id' => $pref->id,
                    'prefecture' => $pref->name,
                    'ville' => $ville->name,
                    'arrondissements' => $pref->arrondissements->map(fn ($a) => (object) ['id' => $a->id, 'name' => $a->name]),
                ]);
            }
        }

        return $result;
    }

    public function createArrondissement(array $data): Arrondissement
    {
        $ville = Ville::firstOrCreate(['name' => $data['ville']]);

        $prefecture = null;
        if (!empty($data['prefecture'])) {
            $prefecture = Prefecture::firstOrCreate([
                'ville_id' => $ville->id,
                'name' => $data['prefecture'],
            ]);
        }

        return Arrondissement::create([
            'ville_id' => $ville->id,
            'prefecture_id' => $prefecture?->id,
            'name' => $data['name'],
        ]);
    }

    public function updateArrondissement(int $id, array $data): Arrondissement
    {
        $arrondissement = Arrondissement::findOrFail($id);
        if (isset($data['ville'])) {
            $ville = Ville::firstOrCreate(['name' => $data['ville']]);
            $arrondissement->ville_id = $ville->id;
        }

        if (array_key_exists('prefecture', $data)) {
            if (!empty($data['prefecture'])) {
                $pref = Prefecture::firstOrCreate([
                    'ville_id' => $arrondissement->ville_id,
                    'name' => $data['prefecture'],
                ]);
                $arrondissement->prefecture_id = $pref->id;
            } else {
                $arrondissement->prefecture_id = null;
            }
        }

        if (isset($data['name'])) {
            $arrondissement->name = $data['name'];
        }

        $arrondissement->save();

        return $arrondissement->load('ville', 'prefecture');
    }

    public function deleteArrondissement(int $id): void
    {
        $arrondissement = Arrondissement::findOrFail($id);
        $arrondissement->delete();
    }
}
