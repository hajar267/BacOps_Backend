<?php

namespace App\Services;

use App\Models\Decharge;
use Illuminate\Support\Collection;

class DechargeService
{
    public function getAll(?string $search = null): Collection
    {
        $query = Decharge::with([
            'signatureBeneficiaire',
            'signatureAgent',
            'session.arrondissement.ville',
            'session.arrondissement.prefecture',
            'session.installations.bac.bacType',
            'session.installations.rfid',
        ]);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('cin', 'like', "%{$search}%")
                    ->orWhere('telephone', 'like', "%{$search}%")
                    ->orWhereHas('session.arrondissement', fn ($sub) =>
                        $sub->where('name', 'like', "%{$search}%")
                    )
                    ->orWhereHas('session.arrondissement.prefecture', fn ($sub) =>
                        $sub->where('name', 'like', "%{$search}%")
                    )
                    ->orWhereHas('session.arrondissement.ville', fn ($sub) =>
                        $sub->where('name', 'like', "%{$search}%")
                    );
            });
        }

        return $query->latest('id')->get();
    }
}