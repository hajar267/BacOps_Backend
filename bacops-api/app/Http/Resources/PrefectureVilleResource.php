<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrefectureVilleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'prefecture' => $this->prefecture,
            'ville' => $this->ville,
            'arrondissements' => $this->arrondissements->map(fn ($a) => [
                'id' => $a->id,
                'name' => $a->name,
            ]),
        ];
    }
}
