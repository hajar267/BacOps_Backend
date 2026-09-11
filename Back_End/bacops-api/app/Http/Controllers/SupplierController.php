<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSupplierRequest;
use App\Http\Resources\SupplierResource;
use App\Services\SupplierService;
use Illuminate\Http\JsonResponse;
use App\Models\Supplier;
use App\Http\Requests\UpdateSupplierRequest;

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

public function update(UpdateSupplierRequest $request, Supplier $supplier): JsonResponse
{
    $supplier = $this->supplierService->update(
        $supplier,
        $request->validated(),
        $request->file('logo')
    );

    return response()->json(['supplier' => new SupplierResource($supplier)]);
}

public function destroy(Supplier $supplier): JsonResponse
{
    $this->supplierService->delete($supplier);

    return response()->json(null, 204);
}

}

