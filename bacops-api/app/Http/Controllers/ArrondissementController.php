<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Arrondissement;
use App\Http\Requests\StoreArrondissementRequest;
use App\Http\Requests\UpdateArrondissementRequest;
use App\Http\Resources\ArrondissementResource;

class ArrondissementController extends Controller
{
    public function index()
    {
        return ArrondissementResource::collection(
            Arrondissement::with(['ville', 'prefecture'])->orderBy('name')->get()
        );
    }

    public function store(StoreArrondissementRequest $request)
    {
        $arrondissement = Arrondissement::create($request->only('ville_id', 'prefecture_id', 'name'));
        return new ArrondissementResource($arrondissement->load(['ville', 'prefecture']));
    }

    public function update(UpdateArrondissementRequest $request, Arrondissement $arrondissement)
    {
        $arrondissement->update($request->only('ville_id', 'prefecture_id', 'name'));
        return new ArrondissementResource($arrondissement->load(['ville', 'prefecture']));
    }

    public function destroy(Arrondissement $arrondissement)
    {
        $arrondissement->delete();
        return response()->json(null, 204);
    }
}
