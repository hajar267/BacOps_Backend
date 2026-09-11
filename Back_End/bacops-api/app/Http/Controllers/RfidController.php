<?php
// app/Http/Controllers/RfidController.php

namespace App\Http\Controllers;

use App\Exceptions\StockServiceException;
use App\Http\Requests\CreateRfidsStockRequest;
use App\Services\RfidStockService;
use Illuminate\Http\JsonResponse;

class RfidController extends Controller
{
    public function __construct(private RfidStockService $service)
    {
    }

    public function store(CreateRfidsStockRequest $request): JsonResponse
    {
        try {
            $result = $this->service->createRfidsStock(
                $request->validated(),
                $request->user()->id
            );

            return response()->json($result, 201);
        } catch (StockServiceException $e) {
            if ($e->getStatusCode() === 409 && $e->getConflicts()) {
                return response()->json([
                    'error' => $e->getMessage(),
                    'conflicts' => $e->getConflicts(),
                ], 409);
            }

            return response()->json([
                'error' => 'Bad Request',
                'message' => $e->getMessage(),
            ], $e->getStatusCode());
        }
    }
}