<?php

namespace App\Services;

use App\Models\Attachment;
use App\Models\Installation;
use App\Models\InstallationSession;
use App\Models\PV;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class PVService
{
    private const DISK = 'public';

    public function generateOrReuseUnsignedPv(array $params): PV
    {
        $criteria = [
            'admin_id' => $params['adminId'],
            'contract_num' => $params['contractNum'] ?? '2/GD/CR/2022',
            'start_date' => $params['startDate'] ?? null,
            'end_date' => $params['endDate'] ?? null,
            'filter_capacite' => $params['filterCapacite'] ?? null,
            'filter_matiere' => $params['filterMatiere'] ?? null,
        ];

        $pv = PV::where($criteria)->whereNull('signed_at')->first();

        if ($pv) {
            return $pv;
        }

        return PV::create($criteria + [
            'pv_number' => $this->nextPvNumber(),
        ]);
    }

    public function getAllPVs()
    {
        return PV::orderByDesc('created_at')->get();
    }

    public function uploadSignedPv(int $pvId, string $fileBinary): PV
    {
        $pv = PV::findOrFail($pvId);
        $path = "pvs/{$pv->pv_number}/signed.pdf";

        Storage::disk(self::DISK)->put($path, $fileBinary);

        $pv->update([
            'signed_pdf_url' => Storage::disk(self::DISK)->url($path),
            'signed_at' => now(),
        ]);

        return $pv;
    }
    public function previewBacs(array $filters): array
    {
        $startDate = $filters['startDate'] ?? $this->getMinInstallationDate();
        $endDate = $filters['endDate'] ?? now();

        $bacTypeFilter = array_filter([
            'nature' => $filters['nature'] ?? null,
            'capacite' => $filters['capacite'] ?? null,
            'matiere' => $filters['matiere'] ?? null,
        ]);

        $installations = Installation::whereNull('uninstalled_at')
            ->whereHas('bac', function ($q) use ($bacTypeFilter) {
                $q->where('status', 'en_service');

                if (! empty($bacTypeFilter)) {
                    $q->whereHas('bacType', function ($q2) use ($bacTypeFilter) {
                        foreach ($bacTypeFilter as $field => $value) {
                            $q2->where($field, $value);
                        }
                    });
                }
            })
            ->whereHas('session', function ($q) use ($startDate, $endDate, $filters) {
                $q->whereBetween('installed_at', [$startDate, $endDate]);

                if (! empty($filters['arrondissement_id'])) {
                    $q->where('arrondissement_id', $filters['arrondissement_id']);
                } elseif (! empty($filters['arrond'])) {
                    $q->whereHas('arrondissement', fn ($q2) => $q2->where('name', $filters['arrond']));
                }
            })
            ->with(['bac.bacType', 'session.arrondissement'])
            ->get();

        if ($installations->isEmpty()) {
            return [];
        }

        $sessionIds = $installations->pluck('session.id')->unique()->values()->all();

        $photoMap = Attachment::where('ref_type', 'installation_session')
            ->whereIn('ref_id', $sessionIds)
            ->where('type', 'photo')
            ->get()
            ->unique('ref_id')
            ->keyBy('ref_id')
            ->map(fn ($a) => $a->url);

        return $installations->map(function ($inst) use ($photoMap) {
            return [
                'nature' => $inst->bac->bacType->nature,
                'capacite' => $inst->bac->bacType->capacite,
                'matiere' => $inst->bac->bacType->matiere,
                'serialNumber' => $inst->bac->serial_number,
                'arrond' => $inst->session->arrondissement?->name,
                'installedAt' => $inst->session->installed_at->toIso8601String(),
                'address' => $inst->session->address,
                'x' => $inst->location_lat ?? $inst->session->location_lat,
                'y' => $inst->location_lng ?? $inst->session->location_lng,
                'photo' => $photoMap->get($inst->session->id) ?? null,
            ];
        })->values()->all();
    }

    private function nextPvNumber(): string
    {
        $year = now()->year;
        $count = PV::whereBetween('created_at', ["{$year}-01-01", "{$year}-12-31"])->count();

        return sprintf('PV-%d-%03d', $year, $count + 1);
    }

    private function getMinInstallationDate(): Carbon
    {
        $min = InstallationSession::min('installed_at');

        return $min ? Carbon::parse($min) : Carbon::createFromTimestamp(0);
    }
}