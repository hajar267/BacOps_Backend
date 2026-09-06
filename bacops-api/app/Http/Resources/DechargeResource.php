<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DechargeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $session = $this->session;
        $arrondissement = $session?->arrondissement;

        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'prenom' => $this->prenom,
            'cin' => $this->cin,
            'telephone' => $this->telephone,
            'createdAt' => $this->created_at,
            'signatureBeneficiaireUrl' => $this->signatureBeneficiaire?->url,
            'signatureAgentUrl' => $this->signatureAgent?->url,
            'session' => $session ? [
                'id' => $session->id,
                'address' => $session->address,
                'pointDeRegroupement' => $session->num_point,
                'installedAt' => $session->installed_at,
                'arrondissement' => $arrondissement?->name,
                'prefecture' => $arrondissement?->prefecture?->name,
                'ville' => $arrondissement?->ville?->name,
                'bacs' => $session->installations->map(fn ($installation) => [
                    'bacSerie' => $installation->bac?->serial_number,
                    'rfidSerie' => $installation->rfid?->rfid_code,
                    'bacType' => $installation->bac?->bacType ? [
                        'nature' => $installation->bac->bacType->nature,
                        'capacite' => $installation->bac->bacType->capacite,
                        'matiere' => $installation->bac->bacType->matiere,
                        'color' => $installation->bac->bacType->color,
                        'variante' => $installation->bac->bacType->variante,
                    ] : null,
                ])->values(),
            ] : null,
        ];
    }
}