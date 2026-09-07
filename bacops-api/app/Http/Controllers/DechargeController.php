<?php

namespace App\Http\Controllers;

use App\Http\Resources\DechargeResource;
use App\Services\DechargeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DechargeController extends Controller
{
    public function __construct(private DechargeService $service) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $decharges = $this->service->getAll($request->query('search'));

            return response()->json(DechargeResource::collection($decharges), 200);
        } catch (\Exception $e) {
            \Log::error('Fetching decharges failed: '.$e->getMessage(), ['exception' => $e]);

            return response()->json(['error' => 'Internal Server Error', 'message' => 'Failed to fetch decharges'], 500);
        }
    }
}