<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrefectureResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'ville' => [
                'id' => $this->ville->id,
                'name' => $this->ville->name,
            ],
            'prefecture' => $this->prefecture ? [
                'id' => $this->prefecture->id,
                'name' => $this->prefecture->name,
            ] : null,
        ];
    }
}
