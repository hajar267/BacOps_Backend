<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$allowedRoles)
    {
        $user = $request->user(); // resolved by auth:api guard, which already ran

        if (!$user) {
            return response()->json([
                'error' => 'Unauthorized',
                'message' => 'Authentication is required',
            ], 401);
        }

        if (!in_array($user->role->name, $allowedRoles)) {
            return response()->json([
                'error' => 'Forbidden',
                'message' => 'You do not have permission to access this resource',
            ], 403);
        }

        return $next($request);
    }
}