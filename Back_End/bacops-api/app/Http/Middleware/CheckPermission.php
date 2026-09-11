<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $requiredPermission)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'error' => 'Unauthorized',
                'message' => 'Authentication is required',
            ], 401);
        }

        $userPermissions = $user->role->permissions ?? [];

        $hasAccess = in_array('*', $userPermissions) || in_array($requiredPermission, $userPermissions);

        if (!$hasAccess) {
            return response()->json([
                'error' => 'Forbidden',
                'message' => "You do not have permission to perform: {$requiredPermission}",
            ], 403);
        }

        return $next($request);
    }
}