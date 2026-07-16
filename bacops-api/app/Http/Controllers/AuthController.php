<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RefreshRequest;


class AuthController extends Controller
{
    public function __construct(private AuthService $authService) {}

    public function login(LoginRequest $request)
    {
        try {
            $result = $this->authService->login(
                $request->validated('username'),
                $request->validated('password'),
            );
            return response()->json($result, 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Unauthorized',
                'message' => $e->getMessage(),
            ], 401);
        }
    }

    public function refresh(RefreshRequest $request)
    {
        try {
            $result = $this->authService->refresh($request->validated('refreshToken'));
            return response()->json($result, 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Unauthorized',
                'message' => $e->getMessage(),
            ], 401);
        }
    }
}
