<?php

namespace App\Services;

use App\Models\Decharge;
use Illuminate\Support\Collection;

class DechargeService
{
    public function getAll(): Collection
    {
        return Decharge::with([
            'signatureBeneficiaire',
            'signatureAgent',
            'session.arrondissement.ville',
            'session.arrondissement.prefecture',
            'session.installations.bac.bacType',
            'session.installations.rfid',
        ])->latest('id')->get();
    }
}