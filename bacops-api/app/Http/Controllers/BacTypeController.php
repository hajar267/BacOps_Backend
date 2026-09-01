<?php
// app/Http/Controllers/BacTypeController.php

namespace App\Http\Controllers;

use App\Exceptions\BacTypeServiceException;
use App\Http\Requests\CreateBacTypeRequest;
use App\Services\BacTypeService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\BacType;
use App\Http\Requests\UpdateBacTypeRequest;

class BacTypeController extends Controller
{
    public function __construct(private BacTypeService $service)
    {
    }

    public function index(): JsonResponse
    {
        $bacTypes = $this->service->getAllBacTypes();
        return response()->json(['bacTypes' => $bacTypes], 200);
    }

    public function natures(): JsonResponse
    {
        $natures = $this->service->getNatures();
        return response()->json(['natures' => $natures], 200);
    }

    public function capacites(Request $request): JsonResponse
    {
        $nature = $request->query('nature');

        if (!$nature) {
            return response()->json(['error' => 'Missing query parameter: nature'], 400);
        }

        $capacites = $this->service->getCapacites($nature);
        return response()->json(['capacites' => $capacites], 200);
    }

    public function matieres(Request $request): JsonResponse
    {
        $nature = $request->query('nature');
        $capacite = $request->query('capacite');

        if (!$nature || !$capacite) {
            return response()->json(['error' => 'Missing query parameters: nature and capacite are required'], 400);
        }

        $matieres = $this->service->getMatieres($nature, $capacite);
        return response()->json(['matieres' => $matieres], 200);
    }

    public function colors(Request $request): JsonResponse
    {
        $nature = $request->query('nature');
        $capacite = $request->query('capacite');
        $matiere = $request->query('matiere');

        if (!$nature || !$capacite || !$matiere) {
            return response()->json(['error' => 'Missing query parameters: nature, capacite and matiere are required'], 400);
        }

        $colors = $this->service->getColors($nature, $capacite, $matiere);
        return response()->json(['colors' => $colors], 200);
    }

    public function store(CreateBacTypeRequest $request): JsonResponse
    {
        try {
            $bacType = $this->service->createBacType($request->validated());

            return response()->json([
                'message' => 'Bac type created successfully',
                'bacType' => $bacType,
            ], 201);
        } catch (BacTypeServiceException $e) {
            $payload = ['error' => $e->getMessage()];

            if ($e->getConflicts()) {
                $payload['conflicts'] = $e->getConflicts();
            }

            return response()->json($payload, $e->getStatusCode());
        }
    }

    public function update(UpdateBacTypeRequest $request, BacType $bacType): JsonResponse
{
    try {
        $bacType = $this->service->updateBacType($bacType, $request->validated());

        return response()->json(['bacType' => $bacType]);
    } catch (BacTypeServiceException $e) {
        $payload = ['error' => $e->getMessage()];
        if ($e->getConflicts()) {
            $payload['conflicts'] = $e->getConflicts();
        }
        return response()->json($payload, $e->getStatusCode());
    }
}

public function destroy(BacType $bacType): JsonResponse
{
    $bacType->update(['is_active' => false]);

    return response()->json(null, 204);
}

}
