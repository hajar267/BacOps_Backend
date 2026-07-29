<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreArrondissementRequest;
use App\Http\Requests\UpdateArrondissementRequest;
use App\Http\Resources\PrefectureVilleResource;
use App\Services\LocationService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;

class LocationController extends Controller
{
    public function __construct(private LocationService $service) {}

    public function tree(): JsonResponse
    {
        try {
            $tree = $this->service->getTree();

            return response()->json(PrefectureVilleResource::collection($tree), 200);
        } catch (\Exception $e) {
            \Log::error('Fetching location tree failed: '.$e->getMessage(), ['exception' => $e]);

            return response()->json(['error' => 'Internal Server Error', 'message' => 'Failed to fetch locations'], 500);
        }
    }

    public function store(StoreArrondissementRequest $request): JsonResponse
    {
        try {
            $arrondissement = $this->service->createArrondissement($request->validated());

            return response()->json($arrondissement->load('prefectureVille'), 201);
        } catch (\Exception $e) {
            \Log::error('Creating arrondissement failed: '.$e->getMessage(), ['exception' => $e]);

            return response()->json(['error' => 'Internal Server Error', 'message' => 'Failed to create arrondissement'], 500);
        }
    }

    public function update(UpdateArrondissementRequest $request, $id): JsonResponse
    {
        try {
            $arrondissement = $this->service->updateArrondissement($id, $request->validated());

            return response()->json($arrondissement->load('prefectureVille'), 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Not Found', 'message' => 'Arrondissement not found'], 404);
        } catch (\Exception $e) {
            \Log::error('Updating arrondissement failed: '.$e->getMessage(), ['exception' => $e]);

            return response()->json(['error' => 'Internal Server Error', 'message' => 'Failed to update arrondissement'], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $this->service->deleteArrondissement($id);

            return response()->json(['message' => 'Arrondissement deleted successfully'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Not Found', 'message' => 'Arrondissement not found'], 404);
        } catch (\Exception $e) {
            \Log::error('Deleting arrondissement failed: '.$e->getMessage(), ['exception' => $e]);

            return response()->json(['error' => 'Internal Server Error', 'message' => 'Failed to delete arrondissement'], 500);
        }
    }
}
