<?php
// app/Http/Controllers/BacController.php

namespace App\Http\Controllers;

use App\Exceptions\StockServiceException;
use App\Http\Requests\CreateBacsStockRequest;
use App\Services\BacStockService;
use Illuminate\Http\JsonResponse;

class BacController extends Controller
{
    public function __construct(private BacStockService $service)
    {
    }

    public function store(CreateBacsStockRequest $request): JsonResponse
    {
        try {
            $result = $this->service->createBacsStock(
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
                'error' => $e->getStatusCode() === 404 ? 'Not Found' : 'Bad Request',
                'message' => $e->getMessage(),
            ], $e->getStatusCode());
        }
    }
}