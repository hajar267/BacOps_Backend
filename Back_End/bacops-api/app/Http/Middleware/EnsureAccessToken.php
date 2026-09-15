<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureAccessToken
{
    public function handle(Request $request, Closure $next)
    {
        $tokenType = auth('api')->payload()->get('type');

        if ($tokenType !== 'access') {
            return response()->json([
                'error' => 'Unauthorized',
                'message' => 'An access token is required',
            ], 401);
        }

        return $next($request);
    }
}