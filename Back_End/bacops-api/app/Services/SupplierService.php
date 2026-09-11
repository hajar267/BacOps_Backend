<?php

namespace App\Services;

use App\Models\Supplier;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

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

    public function update(Supplier $supplier, array $data, ?UploadedFile $logo = null): Supplier
{
    $payload = [];

    if (array_key_exists('nom', $data)) {
        $payload['nom'] = trim($data['nom']);
    }

    if ($logo) {
        if ($supplier->logo_path) {
            Storage::disk('public')->delete($supplier->logo_path);
        }
        $payload['logo_path'] = $logo->storeAs('suppliers/logos', Str::uuid() . '.' . $logo->extension(), 'public');
    }

    $supplier->update($payload);

    return $supplier;
}

public function delete(Supplier $supplier): void
{
    if ($supplier->logo_path) {
        Storage::disk('public')->delete($supplier->logo_path);
    }

    $supplier->delete();
}

}
