<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSupplierRequest;
use App\Http\Resources\SupplierResource;
use App\Services\SupplierService;
use Illuminate\Http\JsonResponse;

class SupplierController extends Controller
{
    public function __construct(private readonly SupplierService $supplierService)
    {
    }

    public function index(): JsonResponse
    {
        $suppliers = $this->supplierService->list();

        return response()->json([
            'suppliers' => SupplierResource::collection($suppliers),
        ]);
    }

public function store(StoreSupplierRequest $request): JsonResponse
{
    $supplier = $this->supplierService->create(
        $request->validated(),
        $request->file('logo')
    );

    return response()->json([
        'supplier' => new SupplierResource($supplier),
    ], 201);
}
}
