<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\PrefectureResource;
use App\Http\Requests\StorePrefectureRequest;
use App\Http\Requests\UpdatePrefectureRequest;
use App\Models\Prefecture;
use App\Models\Arrondissement;

class PrefectureController extends Controller
{
    public function index()
    {
        return PrefectureResource::collection(Prefecture::with('ville')->orderBy('name')->get());
    }

    public function store(StorePrefectureRequest $request)
    {
        $prefecture = Prefecture::create($request->only('ville_id', 'name'));
        return new PrefectureResource($prefecture->load('ville'));
    }

    public function update(UpdatePrefectureRequest $request, Prefecture $prefecture)
    {
        $prefecture->update($request->only('ville_id', 'name'));
        return new PrefectureResource($prefecture->load('ville'));
    }

    public function destroy(Prefecture $prefecture)
    {
        if ($prefecture->arrondissements()->exists()) {
            return response()->json([
                'message' => 'Impossible de supprimer une préfecture liée à des arrondissements.',
            ], 422);
        }

        $prefecture->delete();
        return response()->json(null, 204);
    }
}
