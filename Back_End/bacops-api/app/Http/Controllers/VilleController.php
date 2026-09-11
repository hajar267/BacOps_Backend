<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Ville;
use App\Http\Requests\StoreVilleRequest;
use App\Http\Requests\UpdateVilleRequest;
use App\Http\Resources\VilleResource;

class VilleController extends Controller
{
    public function index()
    {
        return VilleResource::collection(Ville::withCount('prefectures')->orderBy('name')->get());
    }

    public function store(StoreVilleRequest $request)
    {
        return new VilleResource(Ville::create(['name' => $request->name]));
    }

    public function update(UpdateVilleRequest $request, Ville $ville)
    {
        $ville->update(['name' => $request->name]);
        return new VilleResource($ville->loadCount('prefectures'));
    }

    public function destroy(Ville $ville)
    {
        if ($ville->prefectures()->exists() || $ville->arrondissements()->exists()) {
            return response()->json([
                'message' => 'Impossible de supprimer une ville liée à des préfectures ou arrondissements.',
            ], 422);
        }

        $ville->delete();
        return response()->json(null, 204);
    }
}
