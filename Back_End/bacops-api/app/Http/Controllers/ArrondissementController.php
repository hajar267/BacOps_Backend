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

    public function search(Request $request)
    {
        $search = trim((string) $request->query('search', ''));

        if (mb_strlen($search) < 2) {
            return response()->json([]);
        }

        $results = Arrondissement::with(['ville', 'prefecture'])
            ->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhereHas('ville', function ($villeQuery) use ($search) {
                        $villeQuery->where('name', 'like', "%{$search}%");
                    });
            })
            ->orderBy('name')
            ->limit(20)
            ->get();

        return ArrondissementResource::collection($results);
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
