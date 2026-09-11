<?php
// app/Http/Controllers/InstallController.php

namespace App\Http\Controllers;

use App\Exceptions\InstallServiceException;
use App\Http\Requests\CreateInstallRequest;
use App\Services\InstallService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InstallController extends Controller
{
    public function __construct(private InstallService $service)
    {
    }

    public function checkAvailability(Request $request): JsonResponse
    {
        $body = $request->all();
        $installation = $body['installation'] ?? (isset($body['siteInfo'], $body['bacs']) ? $body : null);

        if (!$installation || empty($installation['siteInfo']) || !is_array($installation['bacs'] ?? null)) {
            return response()->json(['error' => 'Bad Request', 'message' => 'siteInfo and bacs are required'], 400);
        }

        if (count($installation['bacs']) === 0) {
            return response()->json(['error' => 'Bad Request', 'message' => 'bacs must be a non-empty array'], 400);
        }

        try {
            $result = $this->service->checkAvailability($installation['siteInfo'], $installation['bacs']);
            return response()->json($result, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Internal Server Error', 'message' => 'Failed to check availability'], 500);
        }
    }

    public function store(CreateInstallRequest $request): JsonResponse
    {
        try {
            $result = $this->service->confirmInstallation(
                $request->validated('installation'),
                $request->user()->id
            );

            return response()->json($result, 201);
        } catch (InstallServiceException $e) {
            if ($e->getStatusCode() === 409) {
                $details = $e->getDetails();
                return response()->json([
                    'error' => $e->getMessage(),
                    'results' => $details['results'] ?? [],
                ], 409);
            }

            return response()->json([
                'error' => $e->getMessage(),
                'message' => $e->getMessage(),
                'details' => $e->getDetails(),
            ], $e->getStatusCode());
        }
    }
}
