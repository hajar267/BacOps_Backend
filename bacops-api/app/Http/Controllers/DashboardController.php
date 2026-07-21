<?php
// app/Http/Controllers/DashboardController.php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(private DashboardService $service)
    {
    }

    private function buildFilters(Request $request): array
    {
        return [
            'nature' => $request->query('nature'),
            'capacite' => $request->query('capacite'),
            'matiere' => $request->query('matiere'),
            'variante' => $request->query('variante'),
            'from' => $request->query('from') ?: null,
            'to' => $request->query('to') ?: null,
            'granularity' => $request->query('granularity'),
        ];
    }

    public function stats(Request $request): JsonResponse
    {
        try {
            $stats = $this->service->getStats($this->buildFilters($request));
            return response()->json($stats, 200);
        } catch (\Exception $e) {
            \Log::error('Dashboard stats failed: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(['error' => 'Internal Server Error', 'message' => 'Failed to compute dashboard stats'], 500);
        }
    }

    public function installations(Request $request): JsonResponse
    {
        try {
            $series = $this->service->getInstallationsSeries($this->buildFilters($request));
            return response()->json($series, 200);
        } catch (\Exception $e) {
            \Log::error('Dashboard installations failed: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(['error' => 'Internal Server Error', 'message' => 'Failed to compute dashboard installations series'], 500);
        }
    }

    public function bacsPerType(): JsonResponse
    {
        try {
            $data = $this->service->getBacsPerType();
            return response()->json($data, 200);
        } catch (\Exception $e) {
            \Log::error('Dashboard bacs-per-type failed: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(['error' => 'Internal Server Error', 'message' => 'Failed to fetch bacs per type'], 500);
        }
    }

    public function bacValue(Request $request): JsonResponse
    {
        try {
            $data = $this->service->getBacValueSeries($this->buildFilters($request));
            return response()->json($data, 200);
        } catch (\Exception $e) {
            \Log::error('Dashboard bac-value failed: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(['error' => 'Internal Server Error', 'message' => 'Failed to compute bac value series'], 500);
        }
    }
}
