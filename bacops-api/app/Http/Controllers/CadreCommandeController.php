<?php

namespace App\Http\Controllers;

use App\Http\Resources\CadreCommandeResource;
use App\Models\CadreCommande;
use Illuminate\Http\JsonResponse;

class CadreCommandeController extends Controller
{
    public function index(): JsonResponse
    {
        $cadreCommandes = CadreCommande::where('is_active', true)->get();

        return response()->json([
            'cadreCommandes' => CadreCommandeResource::collection($cadreCommandes),
        ]);
    }
}