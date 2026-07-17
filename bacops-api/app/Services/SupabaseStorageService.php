<?php
// app/Services/SupabaseStorageService.php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class SupabaseStorageService
{
    public function uploadBinary(string $binary, string $path, string $bucket, string $contentType): string
    {
        $url = config('services.supabase.url');
        $key = config('services.supabase.key');

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$key}",
            'Content-Type' => $contentType,
        ])->withBody($binary, $contentType)
            ->post("{$url}/storage/v1/object/{$bucket}/{$path}");

        if (!$response->successful()) {
            throw new \Exception("Supabase upload failed: {$response->body()}");
        }

        return $this->getPublicUrl($path, $bucket);
    }

    public function getPublicUrl(string $path, string $bucket): string
    {
        $url = config('services.supabase.url');
        return "{$url}/storage/v1/object/public/{$bucket}/{$path}";
    }

    public function remove(string $path, string $bucket): void
    {
        $url = config('services.supabase.url');
        $key = config('services.supabase.key');

        Http::withHeaders([
            'Authorization' => "Bearer {$key}",
        ])->delete("{$url}/storage/v1/object/{$bucket}/{$path}");
    }
}
