<?php

// app/Services/SearchService.php

namespace App\Services;

use App\Exceptions\SearchServiceException;
use App\Models\Bac;
use App\Models\BacHasRFID;
use App\Models\Installation;
use App\Models\BacHistoryEvent;

class SearchService
{
    public function getBacInfoByRfid(string $rfid): ?array
    {
        $normalizedRfid = trim($rfid);

        if ($normalizedRfid === '') {
            throw new SearchServiceException('Le champ rfid ne doit pas être vide', 400);
        }

        $link = BacHasRFID::whereHas('rfid', function ($q) use ($normalizedRfid) {
            $q->where('rfid_code', $normalizedRfid);
        })
            ->whereNull('unassigned_at')
            ->orderByDesc('assigned_at')
            ->with(['bac.bacType', 'rfid'])
            ->first();

        if (! $link) {
            return null;
        }

        $bac = $link->bac;

        // Ordering by a related table's column (session.installed_at) — Eloquent
        // can't do this in a single orderBy() the way Prisma's nested orderBy does,
        // so we fetch candidates and sort in PHP. Fine at this scale (one bac's
        // installation history), but worth knowing if this table ever grows huge.
        $currentInstallation = Installation::where('bac_id', $bac->id)
            ->whereNull('uninstalled_at')
            ->with('session.arrondissement')
            ->get()
            ->sortByDesc(fn ($i) => $i->session?->installed_at)
            ->first();

        return [
            'id' => $bac->id,
            'serialNumber' => $bac->serial_number,
            'rfid' => $link->rfid->rfid_code,
            'status' => $bac->status,
            'bacType' => [
                'nature' => $bac->bacType->nature,
                'capacite' => $bac->bacType->capacite,
                'matiere' => $bac->bacType->matiere,
                'couleur' => $bac->bacType->color,
                'variante' => $bac->bacType->variante,
            ],
            'currentInstallation' => $currentInstallation ? [
                'address' => $currentInstallation->session->address,
                'arrond' => $currentInstallation->session->arrondissement?->name,
                'locationLat' => $currentInstallation->location_lat,
                'locationLng' => $currentInstallation->location_lng,
                'installedAt' => $currentInstallation->session->installed_at->toIso8601String(),
            ] : null,
        ];
    }

public function getBacHistoryById(int $id): array
{
    if ($id < 1) {
        throw new SearchServiceException("L'identifiant du bac doit être un entier positif", 400);
    }

    if (! Bac::where('id', $id)->exists()) {
        throw new SearchServiceException('Bac introuvable', 404);
    }

    $events = BacHistoryEvent::where('bac_id', $id)
        ->with(['agent:id,username', 'installation.session'])
        ->orderByDesc('occurred_at')
        ->get();

    return $events->map(fn ($event) => [
        'action' => $event->action,
        'previousState' => $event->previous_state,
        'newState' => $event->new_state,
        'occurredAt' => $event->occurred_at->toIso8601String(),
        'agent' => $event->agent?->username,
        'address' => $event->installation?->session?->address,
    ])->all();
}
    public function getBacLocations(): array
    {
        $installations = Installation::whereNull('uninstalled_at')
            ->whereHas('bac', fn ($q) => $q->where('status', 'en_service'))
            ->with(['bac.rfids' => function ($q) {
                $q->whereNull('unassigned_at')->orderByDesc('assigned_at')->with('rfid');
            }])
            ->get();

        return $installations->map(function ($installation) {
            $bac = $installation->bac;
            $rfidLink = $bac->rfids->first(); // already ordered desc per-parent by the eager-load constraint above

            return [
                'id' => $bac->id,
                'serialNumber' => $bac->serial_number,
                'rfid' => $rfidLink?->rfid?->rfid_code,
                'locationLat' => $installation->location_lat,
                'locationLng' => $installation->location_lng,
                'status' => $bac->status,
            ];
        })->values()->all();
    }
}
