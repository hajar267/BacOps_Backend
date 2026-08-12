<?php

namespace App\Services;

use App\Models\Supplier;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class SupplierService
{
    public function list(): Collection
    {
        return Supplier::orderBy('nom')->get();
    }

    public function create(array $data, ?UploadedFile $logo = null): Supplier
    {
        $logoPath = $logo
            ? $logo->storeAs('suppliers/logos', Str::uuid() . '.' . $logo->extension(), 'public')
            : null;

        return Supplier::create([
            'nom'       => trim($data['nom']),
            'logo_path' => $logoPath,
        ]);
    }
}