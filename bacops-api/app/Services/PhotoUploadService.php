<?php
// app/Services/PhotoUploadService.php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PhotoUploadService
{
    public function uploadPhoto(string $base64): string
    {
        $data = str_contains($base64, ',') ? explode(',', $base64, 2)[1] : $base64;
        $binary = base64_decode($data);

        $filename = 'installations/' . Str::uuid() . '.jpg';

        $url = config('services.supabase.url');
        $key = config('services.supabase.key');
        $bucket = config('services.supabase.bucket');

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$key}",
            'Content-Type' => 'image/jpeg',
        ])->withBody($binary, 'image/jpeg')
            ->post("{$url}/storage/v1/object/{$bucket}/{$filename}");

        if (!$response->successful()) {
            throw new \Exception('Failed to upload photo: ' . $response->body());
        }

        return "{$url}/storage/v1/object/public/{$bucket}/{$filename}";
    }
}