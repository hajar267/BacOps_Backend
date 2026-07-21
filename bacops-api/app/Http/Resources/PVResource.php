<?php
// app/Http/Resources/PVResource.php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PVResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'adminId' => $this->admin_id,
            'contractNum' => $this->contract_num,
            'pvNumber' => $this->pv_number,
            'startDate' => $this->start_date?->toIso8601String(),
            'endDate' => $this->end_date?->toIso8601String(),
            'filterCapacite' => $this->filter_capacite,
            'filterMatiere' => $this->filter_matiere,
            'pdfUrl' => $this->pdf_url,
            'signedPdfUrl' => $this->signed_pdf_url,
            'signedAt' => $this->signed_at?->toIso8601String(),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
