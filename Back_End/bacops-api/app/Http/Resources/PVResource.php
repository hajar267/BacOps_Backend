<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PVResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'pvNumber' => $this->pv_number,
            'contractNum' => $this->contract_num,
            'startDate' => $this->start_date,
            'endDate' => $this->end_date,
            'filterCapacite' => $this->filter_capacite,
            'filterMatiere' => $this->filter_matiere,
            'signedPdfUrl' => $this->signed_pdf_url,
            'isSigned' => (bool) $this->signed_at,
            'signedAt' => $this->signed_at,
            'createdAt' => $this->created_at,
        ];
    }
}