<?php

// app/Services/InstallService.php

namespace App\Services;

use App\Exceptions\InstallServiceException;
use App\Models\Attachment;
use App\Models\Bac;
use App\Models\BacHasRFID;
use App\Models\Installation;
use App\Models\InstallationSession;
use App\Models\RFID;
use App\Models\StockSummaryBac;
use App\Models\StockSummaryRFID;
use Illuminate\Support\Facades\DB;

class InstallService
{
    public function __construct(
        private BacStockService $bacService,
        private RfidStockService $rfidService,
        private PhotoUploadService $photoService,
        private BacHistoryService $historyService,
    ) {}

    private function normalizeText($value): string
    {
        return trim((string) ($value ?? ''));
    }

    private function parseLocalisation(?string $value): array
    {
        if (! $value) {
            return ['latitude' => null, 'longitude' => null];
        }

        $parts = array_map('trim', explode(',', $value));

        if (count($parts) !== 2) {
            throw new InstallServiceException('localisation must be in "lat,lng" format', 400);
        }

        $latitude = is_numeric($parts[0]) ? (float) $parts[0] : null;
        $longitude = is_numeric($parts[1]) ? (float) $parts[1] : null;

        if ($latitude === null || $longitude === null) {
            throw new InstallServiceException('localisation must contain valid latitude and longitude values', 400);
        }

        return ['latitude' => $latitude, 'longitude' => $longitude];
    }

    private function findDuplicateValues(array $values): array
    {
        $seen = [];
        $duplicates = [];

        foreach ($values as $value) {
            if (isset($seen[$value])) {
                $duplicates[$value] = true;

                continue;
            }
            $seen[$value] = true;
        }

        return array_keys($duplicates);
    }

    private function updateBacSummary(int $bacTypeId): void
    {
        $summary = StockSummaryBac::where('bac_type_id', $bacTypeId)->first();

        if (! $summary) {
            StockSummaryBac::create([
                'bac_type_id' => $bacTypeId,
                'total' => 1,
                'en_stock' => 0,
                'en_service' => 1,
                'en_reparation' => 0,
                'perdu' => 0,
                'mis_en_rebut' => 0,
            ]);

            return;
        }

        if (($summary->en_stock ?? 0) <= 0) {
            throw new InstallServiceException('Bac stock summary is inconsistent with installation state', 409);
        }

        $summary->decrement('en_stock');
        $summary->increment('en_service');
    }

    private function updateRfidSummary(): void
    {
        $summary = StockSummaryRFID::first();

        if (! $summary) {
            StockSummaryRFID::create([
                'total' => 1,
                'disponible' => 0,
                'en_service' => 1,
                'perdu' => 0,
            ]);

            return;
        }

        if (($summary->disponible ?? 0) <= 0) {
            throw new InstallServiceException('RFID stock summary is inconsistent with installation state', 409);
        }

        $summary->update([
            'disponible' => ($summary->disponible ?? 0) - 1,
            'en_service' => ($summary->en_service ?? 0) + 1,
        ]);
    }

    public function checkAvailability(array $siteInfo, array $pairs): array
    {
        $serials = array_map(fn ($p) => $this->normalizeText($p['serial'] ?? $p['bacSerie'] ?? null), $pairs);
        $rfids = array_map(fn ($p) => $this->normalizeText($p['rfid'] ?? $p['rfidSerie'] ?? null), $pairs);

        ['map' => $bacMap] = $this->bacService->findBacsBySerialsAndSite($serials, $siteInfo);
        $rfidMap = $this->rfidService->findRfidsByTags($rfids);

        $results = [];
        foreach ($pairs as $index => $pair) {
            $serial = $serials[$index];
            $rfid = $rfids[$index];

            $bacItem = $bacMap->get($serial);
            $rfidItem = $rfidMap->get($rfid);

            $bacResult = $this->bacService->isBacAvailableForItem($bacItem);
            $rfidResult = $this->rfidService->isRfidAvailableForItem($rfidItem);

            $results[] = [
                'serial' => $serial,
                'rfid' => $rfid,
                'bac' => $bacResult,
                'rfidAvailability' => $rfidResult,
                'bacStatus' => $bacResult['status'],
                'rfidStatus' => $rfidResult['status'],
                'canInstall' => $bacResult['available'] && $rfidResult['available'],
            ];
        }

        $canInstallAll = collect($results)->every(fn ($r) => $r['canInstall']);

        return ['results' => $results, 'canInstall' => $canInstallAll];
    }

    public function confirmInstallation(array $installation, int $currentUserId): array
    {
        if (empty($installation['bacs']) || ! is_array($installation['bacs'])) {
            throw new InstallServiceException('installation.bacs is required', 400);
        }

        $bacSeries = array_map(fn ($p) => $this->normalizeText($p['bacSerie']), $installation['bacs']);
        $rfidSeries = array_map(fn ($p) => $this->normalizeText($p['rfidSerie']), $installation['bacs']);

        $duplicateBacs = $this->findDuplicateValues($bacSeries);
        $duplicateRfids = $this->findDuplicateValues($rfidSeries);

        if (count($duplicateBacs) > 0 || count($duplicateRfids) > 0) {
            throw new InstallServiceException('Duplicate Bac or RFID values found in the request', 400, [
                'duplicateBacs' => $duplicateBacs,
                'duplicateRfids' => $duplicateRfids,
            ]);
        }

        $siteInfo = $installation['siteInfo'] ?? [];
        ['map' => $bacMap] = $this->bacService->findBacsBySerialsAndSite($bacSeries, $siteInfo);
        $rfidMap = $this->rfidService->findRfidsByTags($rfidSeries);

        $parsedLocalisation = $this->parseLocalisation($installation['localisation'] ?? null);
        $location = $installation['location'] ?? [];
        $sessionPoint = $this->normalizeText($location['pointDeRegroupement'] ?? null);
        $sessionAddress = $this->normalizeText($location['address'] ?? null);
        $sessionArrondissementId = ! empty($location['arrondissement_id']) ? (int) $location['arrondissement_id'] : null;

        $installedAt = ! empty($installation['installedAt'])
            ? \DateTime::createFromFormat(\DateTime::ATOM, $installation['installedAt']) ?: new \DateTime($installation['installedAt'])
            : new \DateTime;

        $availability = [];
        foreach ($installation['bacs'] as $index => $pair) {
            $bacSerie = $bacSeries[$index];
            $rfidSerie = $rfidSeries[$index];

            $bacItem = $bacMap->get($bacSerie);
            $rfidItem = $rfidMap->get($rfidSerie);

            $bacAvailability = $this->bacService->isBacAvailableForItem($bacItem);
            $rfidAvailability = $this->rfidService->isRfidAvailableForItem($rfidItem);

            $availability[] = [
                'serial' => $bacSerie,
                'rfid' => $rfidSerie,
                'bac' => $bacAvailability,
                'rfidAvailability' => $rfidAvailability,
                'bacStatus' => $bacAvailability['status'],
                'rfidStatus' => $rfidAvailability['status'],
                'canInstall' => $bacAvailability['available'] && $rfidAvailability['available'],
                'bacItem' => $bacItem,
                'rfidItem' => $rfidItem,
            ];
        }

        $failedAvailability = array_filter($availability, fn ($item) => ! $item['canInstall']);

        if (count($failedAvailability) > 0) {
            $conflictResults = array_map(function ($item) {
                unset($item['bacItem'], $item['rfidItem']);

                return $item;
            }, $availability);

            throw new InstallServiceException('One or more Bac/RFID pairs are not installable', 409, [
                'results' => $conflictResults,
            ]);
        }

        $photoUrl = null;
        if (! empty($installation['photo'])) {
            try {
                $photoUrl = $this->photoService->uploadPhoto($installation['photo']);
            } catch (\Exception $e) {
                throw new InstallServiceException('Failed to upload photo', 500, $e->getMessage());
            }
        }

        $result = DB::transaction(function () use (
            $currentUserId, $sessionPoint, $parsedLocalisation, $sessionAddress, $sessionArrondissementId,
            $installedAt, $photoUrl, $availability
        ) {
            $session = InstallationSession::create([
                'agent_id' => $currentUserId,
                'num_point' => $sessionPoint ?: null,
                'location_lat' => $parsedLocalisation['latitude'],
                'location_lng' => $parsedLocalisation['longitude'],
                'address' => $sessionAddress ?: null,
                'arrondissement_id' => $sessionArrondissementId,
                'installed_at' => $installedAt,
            ]);

            if ($photoUrl) {
                Attachment::create([
                    'ref_type' => 'installation_session',
                    'ref_id' => $session->id,
                    'type' => 'photo',
                    'url' => $photoUrl,
                    'uploaded_by' => $currentUserId,
                ]);
            }

            $installations = [];

            foreach ($availability as $item) {
                if (! $item['bacItem'] || ! $item['rfidItem']) {
                    throw new InstallServiceException('Unable to resolve Bac/RFID pair during installation', 409);
                }

                $installationRow = Installation::create([
                    'bac_id' => $item['bacItem']->id,
                    'rfid_id' => $item['rfidItem']->id,
                    'installation_session_id' => $session->id,
                    'location_lat' => $parsedLocalisation['latitude'],
                    'location_lng' => $parsedLocalisation['longitude'],
                ]);

                $this->historyService->record(
                    bacId: $item['bacItem']->id,
                    action: 'installation',
                    previousState: $item['bacItem']->status,
                    newState: 'en_service',
                    agentId: $currentUserId,
                    rfidId: $item['rfidItem']->id,
                    installationId: $installationRow->id,
                    occurredAt: $installedAt,
                );

                BacHasRFID::create([
                    'bac_id' => $item['bacItem']->id,
                    'rfid_id' => $item['rfidItem']->id,
                    'assigned_by' => $currentUserId,
                    'assigned_at' => now(),
                ]);

                Bac::where('id', $item['bacItem']->id)->update(['status' => 'en_service']);
                RFID::where('id', $item['rfidItem']->id)->update(['status' => 'en_service']);

                $this->updateBacSummary($item['bacItem']->bac_type_id);
                $this->updateRfidSummary();

                $installations[] = [
                    'id' => $installationRow->id,
                    'bacSerie' => $item['serial'],
                    'rfidSerie' => $item['rfid'],
                    'bacId' => $item['bacItem']->id,
                    'rfidId' => $item['rfidItem']->id,
                ];
            }

            return ['sessionId' => $session->id, 'installations' => $installations];
        });

        return [
            'message' => 'Installation saved successfully',
            'sessionId' => $result['sessionId'],
            'installations' => $result['installations'],
        ];
    }
}
