<?php
// app/Services/PVService.php

namespace App\Services;

use App\Models\Attachment;
use App\Models\Bac;
use App\Models\Installation;
use App\Models\InstallationSession;
use App\Models\PV;
use Carbon\Carbon;

class PVService
{
    private const BUCKET = 'pvs';

    public function __construct(private SupabaseStorageService $storage)
    {
    }

    public function createPv(array $params): PV
    {
        $year = now()->year;
        $count = PV::whereBetween('created_at', ["{$year}-01-01", "{$year}-12-31"])->count();
        $pvNumber = sprintf('PV-%d-%03d', $year, $count + 1);
        $filename = "{$pvNumber}_" . now()->timestamp . '.pdf';
        $path = "unsigned/{$filename}";

        $pdfUrl = $this->storage->uploadBinary($params['fileBuffer'], $path, self::BUCKET, 'application/pdf');

        return PV::create([
            'admin_id' => $params['adminId'],
            'contract_num' => $params['contractNum'] ?? '2/GD/CR/2022',
            'pv_number' => $pvNumber,
            'start_date' => $params['startDate'] ?? null,
            'end_date' => $params['endDate'] ?? null,
            'filter_capacite' => $params['filterCapacite'] ?? null,
            'filter_matiere' => $params['filterMatiere'] ?? null,
            'pdf_url' => $pdfUrl,
        ]);
    }

    public function getAllPVs()
    {
        return PV::orderByDesc('created_at')->get();
    }

    public function uploadSignedPv(int $pvId, string $fileBuffer): PV
    {
        $filename = "PV-{$pvId}_signed_" . now()->timestamp . '.pdf';
        $path = "signed/{$filename}";

        $signedUrl = $this->storage->uploadBinary($fileBuffer, $path, self::BUCKET, 'application/pdf');

        try {
            $pv = PV::findOrFail($pvId);
            $pv->update([
                'signed_pdf_url' => $signedUrl,
                'signed_at' => now(),
            ]);

            return $pv;
        } catch (\Exception $e) {
            $this->storage->remove($path, self::BUCKET);
            throw $e;
        }
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

                if (!empty($bacTypeFilter)) {
                    $q->whereHas('bacType', function ($q2) use ($bacTypeFilter) {
                        foreach ($bacTypeFilter as $field => $value) {
                            $q2->where($field, $value);
                        }
                    });
                }
            })
            ->whereHas('session', function ($q) use ($startDate, $endDate, $filters) {
                $q->whereBetween('installed_at', [$startDate, $endDate]);

                if (!empty($filters['arrond'])) {
                    $q->where('arrond', $filters['arrond']);
                }
            })
            ->with(['bac.bacType', 'session'])
            ->get();

        if ($installations->isEmpty()) {
            return [];
        }

        $sessionIds = $installations->pluck('session.id')->unique()->values()->all();

        $photoMap = Attachment::where('ref_type', 'installation_session')
            ->whereIn('ref_id', $sessionIds)
            ->where('type', 'photo')
            ->get()
            ->unique('ref_id') // "take the first photo per session" — same as the JS Map dedup logic
            ->keyBy('ref_id')
            ->map(fn ($a) => $a->url);

        return $installations->map(function ($inst) use ($photoMap) {
            return [
                'nature' => $inst->bac->bacType->nature,
                'capacite' => $inst->bac->bacType->capacite,
                'matiere' => $inst->bac->bacType->matiere,
                'serialNumber' => $inst->bac->serial_number,
                'arrond' => $inst->session->arrond,
                'installedAt' => $inst->session->installed_at->toIso8601String(),
                'address' => $inst->session->address,
                'x' => $inst->location_lat ?? $inst->session->location_lat,
                'y' => $inst->location_lng ?? $inst->session->location_lng,
                'photo' => $photoMap->get($inst->session->id) ?? null,
            ];
        })->values()->all();
    }

    private function getMinInstallationDate(): Carbon
    {
        $min = InstallationSession::min('installed_at');
        return $min ? Carbon::parse($min) : Carbon::createFromTimestamp(0);
    }
}
