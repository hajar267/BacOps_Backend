<?php
// app/Services/PhotoUploadService.php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PhotoUploadService
{
    private const DISK = 'public';

    public function uploadPhoto(string $base64): string
    {
        $data = str_contains($base64, ',') ? explode(',', $base64, 2)[1] : $base64;
        $binary = base64_decode($data);

        $path = 'installations/'.Str::uuid().'.jpg';

        Storage::disk(self::DISK)->put($path, $binary);

        return Storage::disk(self::DISK)->url($path);
    }

    public function uploadSignature(string $base64): string
    {
        $data = str_contains($base64, ',') ? explode(',', $base64, 2)[1] : $base64;
        $binary = base64_decode($data);

        $path = 'decharges/'.Str::uuid().'.png';

        Storage::disk(self::DISK)->put($path, $binary);

        return Storage::disk(self::DISK)->url($path);
    }
}