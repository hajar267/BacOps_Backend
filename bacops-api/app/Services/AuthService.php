<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Auth\Access\AuthorizationException;

class AuthService
{
    public function login(string $username, string $password): array
    {
        $user = User::where('username', $username)
            ->where('is_active', true)
            ->with('role')
            ->first();

        if (!$user) {
            throw new \Exception('Invalid credentials');
        }

        if (!$user->role) {
            throw new \Exception('User role is not configured');
        }

        if (!Hash::check($password, $user->password)) {
            throw new \Exception('Invalid credentials');
        }

        // Access token — short TTL from config/jwt.php
        $accessToken = JWTAuth::claims(['type' => 'access'])
            ->fromUser($user);

        // Refresh token — issued with a longer custom TTL
        $refreshToken = JWTAuth::factory()->setTTL(config('jwt.refresh_ttl'))
            ->claims(['type' => 'refresh'])
            ->fromSubject($user);

        return [
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'role' => [
                    'name' => $user->role->name,
                    'permissions' => $user->role->permissions ?? [],
                ],
                'firstName' => $user->first_name,
                'lastName' => $user->last_name,
            ],
            'accessToken' => $accessToken,
            'refreshToken' => $refreshToken,
        ];
    }

    public function refresh(string $refreshToken): array
    {
        $payload = JWTAuth::setToken($refreshToken)->getPayload();

        if ($payload->get('type') !== 'refresh') {
            throw new \Exception('Invalid token type');
        }

        $user = User::where('id', $payload->get('sub'))
            ->where('is_active', true)
            ->with('role')
            ->first();

        if (!$user) {
            throw new \Exception('User not found');
        }

        $accessToken = JWTAuth::claims(['type' => 'access'])->fromUser($user);

        return ['accessToken' => $accessToken];
    }
}