<?php
// app/Services/DashboardService.php

namespace App\Services;

use App\Models\Bac;
use App\Models\BacHistoryEvent;
use App\Models\Commande;
use App\Models\Installation;
use App\Models\InstallationSession;
use App\Models\RFID;
use App\Models\StockSummaryBac;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    private function toEndOfDay(?Carbon $d): Carbon
    {
        return ($d ? $d->copy() : now())->setTime(23, 59, 59, 999000);
    }

    private function toStartOfDay(Carbon $d): Carbon
    {
        return $d->copy()->setTime(0, 0, 0, 0);
    }

    private function toStartOfHour(Carbon $d): Carbon
    {
        return $d->copy()->setTime($d->hour, 0, 0, 0);
    }

    private function toStartOfWeek(Carbon $d): Carbon
    {
        return $this->toStartOfDay($d)->startOfWeek(Carbon::MONDAY);
    }

    private function toStartOfMonth(Carbon $d): Carbon
    {
        return $d->copy()->startOfMonth();
    }

    private function toStartOfYear(Carbon $d): Carbon
    {
        return $d->copy()->startOfYear();
    }

    private function formatLabel(Carbon $date, string $granularity): string
    {
        return match ($granularity) {
            'hourly' => $date->format('Y-m-d H:00'),
            'daily', 'weekly' => $date->format('Y-m-d'),
            'monthly' => $date->format('Y-m'),
            'yearly' => $date->format('Y'),
        };
    }

    private function getBucketStart(Carbon $date, string $granularity): Carbon
    {
        return match ($granularity) {
            'hourly' => $this->toStartOfHour($date),
            'daily' => $this->toStartOfDay($date),
            'weekly' => $this->toStartOfWeek($date),
            'monthly' => $this->toStartOfMonth($date),
            'yearly' => $this->toStartOfYear($date),
        };
    }

    private function addBucket(Carbon $date, string $granularity): Carbon
    {
        $next = $date->copy();

        match ($granularity) {
            'hourly' => $next->addHour(),
            'daily' => $next->addDay(),
            'weekly' => $next->addDays(7),
            'monthly' => $next->addMonth(),
            'yearly' => $next->addYear(),
        };

        return $this->getBucketStart($next, $granularity);
    }

    private function computeGranularity(Carbon $from, Carbon $to): string
    {
        $days = max(0, $from->copy()->startOfDay()->diffInDays($to->copy()->startOfDay()));

        if ($days <= 2) return 'hourly';
        if ($days <= 28) return 'daily';
        if ($days <= 90) return 'weekly';
        if ($days <= 730) return 'monthly';
        return 'yearly';
    }

    private function applyBacTypeFilter($query, array $filters): void
    {
        $bacTypeFilter = array_filter([
            'nature' => $filters['nature'] ?? null,
            'capacite' => $filters['capacite'] ?? null,
            'matiere' => $filters['matiere'] ?? null,
            'variante' => $filters['variante'] ?? null,
        ], fn ($v) => $v !== null && $v !== 'Tous');

        if (!empty($bacTypeFilter)) {
            $query->whereHas('bacType', function ($q) use ($bacTypeFilter) {
                foreach ($bacTypeFilter as $field => $value) {
                    $q->where($field, $value);
                }
            });
        }
    }

    /**
     * Pure snapshot — "what does the fleet look like right now."
     * Intentionally ignores from/to: only the bac-type filters (nature,
     * capacite, matiere, variante) affect this. Date-range filtering
     * belongs to getBacValueSeries() below, not here.
     */
    public function getStats(array $filters): array
    {
        $bacQuery = fn () => Bac::query()->tap(fn ($q) => $this->applyBacTypeFilter($q, $filters));

        $total = $bacQuery()->count();
        $enStock = $bacQuery()->where('status', 'en_stock')->count();
        $enService = $bacQuery()->where('status', 'en_service')->count();
        $enReparation = $bacQuery()->where('status', 'en_reparation')->count();
        $perdu = $bacQuery()->where('status', 'perdu')->count();
        $misEnRebut = $bacQuery()->where('status', 'mis_en_rebut')->count();

        $rfidQuery = fn () => RFID::query();
        $rfidTotal = $rfidQuery()->count();
        $rfidDisponible = $rfidQuery()->whereIn('status', ['en_stock', 'disponible'])->count();
        $rfidEnService = $rfidQuery()->where('status', 'en_service')->count();
        $rfidPerdu = $rfidQuery()->where('status', 'perdu')->count();

        return [
            'bacs' => [
                'total' => $total,
                'en_stock' => $enStock,
                'en_service' => $enService,
                'en_repara6tion' => $enReparation,
                'perdu' => $perdu,
                'mis_en_rebut' => $misEnRebut,
            ],
            'rfids' => [
                'total' => $rfidTotal,
                'disponible' => $rfidDisponible,
                'en_service' => $rfidEnService,
                'perdu' => $rfidPerdu,
            ],
        ];
    }

    public function getBacsPerType()
    {
        return StockSummaryBac::with('bacType:id,nature,capacite,matiere,color,variante')
            ->orderBy('bac_type_id', 'asc')
            ->get()
            ->map(fn ($summary) => [
                'enStock' => $summary->en_stock,
                'bacType' => $summary->bacType ? [
                    'id' => $summary->bacType->id,
                    'nature' => $summary->bacType->nature,
                    'capacite' => $summary->bacType->capacite,
                    'variante' => $summary->bacType->variante,
                    'matiere' => $summary->bacType->matiere,
                    'color' => $summary->bacType->color,
                ] : null,
            ])->values()->all();
    }

    public function getInstallationsSeries(array $filters): array
    {
        $fromDate = !empty($filters['from'])
            ? $this->toStartOfDay(Carbon::parse($filters['from']))
            : $this->getMinInstallationDate();
        $toDate = !empty($filters['to'])
            ? $this->toEndOfDay(Carbon::parse($filters['to']))
            : now();

        $granularity = $filters['granularity'] ?? $this->computeGranularity($fromDate, $toDate);
        $rangeStart = $this->getBucketStart($fromDate, $granularity);
        $rangeEnd = $this->getBucketStart($toDate, $granularity);

        $query = Installation::whereHas('session', function ($q) use ($fromDate, $toDate) {
            $q->whereBetween('installed_at', [$fromDate, $toDate]);
        });

        $bacTypeFilter = array_filter([
            'nature' => $filters['nature'] ?? null,
            'capacite' => $filters['capacite'] ?? null,
            'matiere' => $filters['matiere'] ?? null,
            'variante' => $filters['variante'] ?? null,
        ], fn ($v) => $v !== null && $v !== 'Tous');

        if (!empty($bacTypeFilter)) {
            $query->whereHas('bac.bacType', function ($q) use ($bacTypeFilter) {
                foreach ($bacTypeFilter as $field => $value) {
                    $q->where($field, $value);
                }
            });
        }

        $rows = $query->with('session:id,installed_at')->get(['id', 'installation_session_id']);

        $counts = [];
        foreach ($rows as $row) {
            $bucketStart = $this->getBucketStart(Carbon::parse($row->session->installed_at), $granularity);
            $label = $this->formatLabel($bucketStart, $granularity);
            $counts[$label] = ($counts[$label] ?? 0) + 1;
        }

        $series = [];
        for ($cursor = $rangeStart->copy(); $cursor->lte($rangeEnd); $cursor = $this->addBucket($cursor, $granularity)) {
            $label = $this->formatLabel($cursor, $granularity);
            $series[] = ['label' => $label, 'count' => $counts[$label] ?? 0];
        }

        return [
            'granularity' => $granularity,
            'from' => $fromDate->toIso8601String(),
            'to' => $toDate->toIso8601String(),
            'series' => $series,
        ];
    }

    /**
     * Range-aware — the only chart where from/to actually apply.
     * Reconstructs each bac's status as of every bucket's end date from
     * its own event history, instead of reading today's live status.
     */
    public function getBacValueSeries(array $filters): array
    {
        $fromDate = !empty($filters['from'])
            ? $this->toStartOfDay(Carbon::parse($filters['from']))
            : $this->getMinInstallationDate();
        $toDate = !empty($filters['to'])
            ? $this->toEndOfDay(Carbon::parse($filters['to']))
            : now();

        $granularity = $filters['granularity'] ?? $this->computeGranularity($fromDate, $toDate);
        $rangeStart = $this->getBucketStart($fromDate, $granularity);
        $rangeEnd = $this->getBucketStart($toDate, $granularity);

        $bacTypeFilter = array_filter([
            'nature' => $filters['nature'] ?? null,
            'capacite' => $filters['capacite'] ?? null,
            'matiere' => $filters['matiere'] ?? null,
            'variante' => $filters['variante'] ?? null,
        ], fn ($v) => $v !== null && $v !== 'Tous');

        $bacsQuery = Bac::query();
        if (!empty($bacTypeFilter)) {
            $bacsQuery->whereHas('bacType', function ($q) use ($bacTypeFilter) {
                foreach ($bacTypeFilter as $field => $value) {
                    $q->where($field, $value);
                }
            });
        }

        $bacs = $bacsQuery->with('commande:id,price')->get(['id', 'commande_id']);
        $priceByBacId = $bacs->mapWithKeys(fn ($bac) => [$bac->id => (float) ($bac->commande->price ?? 0)]);
        $bacIds = $bacs->pluck('id');

        $eventsByBac = BacHistoryEvent::whereIn('bac_id', $bacIds)
            ->orderBy('occurred_at')
            ->get(['bac_id', 'new_state', 'occurred_at'])
            ->groupBy('bac_id')
            ->map(fn ($group) => $group->values());

        $pointer = [];
        $currentState = [];
        foreach ($bacIds as $id) {
            $pointer[$id] = 0;
            $currentState[$id] = null;
        }

        $series = [];
        for ($cursor = $rangeStart->copy(); $cursor->lte($rangeEnd); $cursor = $this->addBucket($cursor, $granularity)) {
            $bucketEnd = $cursor->copy()->setTime(23, 59, 59, 999000);

            $values = ['en_stock' => 0, 'en_service' => 0, 'en_reparation' => 0, 'perdu' => 0, 'mis_en_rebut' => 0];

            foreach ($bacIds as $id) {
                $events = $eventsByBac->get($id) ?? collect();

                while ($pointer[$id] < $events->count() && $events[$pointer[$id]]->occurred_at->lte($bucketEnd)) {
                    $currentState[$id] = $events[$pointer[$id]]->new_state;
                    $pointer[$id]++;
                }

                if ($currentState[$id] !== null && array_key_exists($currentState[$id], $values)) {
                    $values[$currentState[$id]] += $priceByBacId[$id] ?? 0;
                }
            }

            $series[] = ['label' => $this->formatLabel($cursor, $granularity), 'values' => $values];
        }

        return [
            'granularity' => $granularity,
            'from' => $fromDate->toIso8601String(),
            'to' => $toDate->toIso8601String(),
            'series' => $series,
        ];
    }

    private function getMinInstallationDate(): Carbon
    {
        $min = InstallationSession::min('installed_at');
        return $min ? Carbon::parse($min) : Carbon::createFromTimestamp(0);
    }
}