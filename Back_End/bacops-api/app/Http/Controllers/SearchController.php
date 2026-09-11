<?php
// app/Http/Controllers/SearchController.php

namespace App\Http\Controllers;

use App\Exceptions\SearchServiceException;
use App\Services\SearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __construct(private SearchService $service)
    {
    }

    public function infos(Request $request): JsonResponse
    {
        $rfid = $request->query('rfid');

        if (!$rfid) {
            return response()->json(['error' => 'Bad Request', 'message' => 'rfid is required'], 400);
        }

        try {
            $bac = $this->service->getBacInfoByRfid($rfid);

            if (!$bac) {
                return response()->json(['error' => 'Not Found', 'message' => 'Bac not found for this RFID'], 404);
            }

            return response()->json($bac, 200);
        } catch (SearchServiceException $e) {
            return response()->json(['error' => $e->getMessage(), 'message' => $e->getMessage()], $e->getStatusCode());
        }
    }

    public function history(Request $request, $id): JsonResponse
    {
        $bacId = (int) $id;

        if ($bacId < 1) {
            return response()->json(['error' => 'Bad Request', 'message' => 'id must be a positive integer'], 400);
        }

        try {
            $history = $this->service->getBacHistoryById($bacId);
            return response()->json($history, 200);
        } catch (SearchServiceException $e) {
            return response()->json(['error' => $e->getMessage(), 'message' => $e->getMessage()], $e->getStatusCode());
        }
    }

    public function locations(): JsonResponse
    {
        $locations = $this->service->getBacLocations();
        return response()->json($locations, 200);
    }
}
