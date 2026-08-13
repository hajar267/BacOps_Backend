<?php

namespace App\Http\Controllers;

use App\Http\Resources\CadreCommandeResource;
use App\Models\CadreCommande;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreCadreCommandeRequest;

class CadreCommandeController extends Controller
{
    public function index(): JsonResponse
    {
        $cadreCommandes = CadreCommande::where('is_active', true)->get();

        return response()->json([
            'cadreCommandes' => CadreCommandeResource::collection($cadreCommandes),
        ]);
    }


    public function store(StoreCadreCommandeRequest $request): JsonResponse
    {
        $cadreCommande = CadreCommande::create([
            'label' => trim($request->validated('label')),
            'is_active' => true,
        ]);

        return response()->json([
            'cadreCommande' => new CadreCommandeResource($cadreCommande),
        ], 201);
    }
}