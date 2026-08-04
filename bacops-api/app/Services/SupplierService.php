<?php

namespace App\Services;

use App\Models\Supplier;
use Illuminate\Database\Eloquent\Collection;

class SupplierService
{
    public function list(): Collection
    {
        return Supplier::orderBy('nom')->get();
    }

    public function create(array $data): Supplier
    {
        return Supplier::create([
            'nom' => trim($data['nom']),
        ]);
    }
}
