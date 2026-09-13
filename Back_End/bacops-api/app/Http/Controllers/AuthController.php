<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RefreshRequest;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;


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

    public function logout(Request $request)
    {
        $request->validate([
            'refreshToken' => ['nullable', 'string'],
        ]);

        auth('api')->logout();

        if ($request->filled('refreshToken')) {
            try {
                JWTAuth::setToken($request->input('refreshToken'))->invalidate();
            } catch (\Throwable) {
            }
        }

        return response()->json(['message' => 'Logged out successfully']);
    }
}
