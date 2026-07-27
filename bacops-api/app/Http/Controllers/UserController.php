<?php
// app/Http/Controllers/UserController.php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function __construct(private UserService $service)
    {
    }

    public function index(): JsonResponse
    {
        try {
            $users = $this->service->getAllUsers();
            return response()->json(UserResource::collection($users), 200);
        } catch (\Exception $e) {
            \Log::error('Fetching users failed: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(['error' => 'Internal Server Error', 'message' => 'Failed to fetch users'], 500);
        }
    }
}
