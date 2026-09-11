<?php

// app/Http/Controllers/UserController.php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function __construct(private UserService $service) {}

    public function index(): JsonResponse
    {
        try {
            $users = $this->service->getAllUsers();

            return response()->json(UserResource::collection($users), 200);
        } catch (\Exception $e) {
            \Log::error('Fetching users failed: '.$e->getMessage(), ['exception' => $e]);

            return response()->json(['error' => 'Internal Server Error', 'message' => 'Failed to fetch users'], 500);
        }
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        try {
            $user = $this->service->createUser($request->validated());

            return response()->json(new UserResource($user), 201);
        } catch (\Exception $e) {
            \Log::error('Creating user failed: '.$e->getMessage(), ['exception' => $e]);

            return response()->json([
                'error' => 'Internal Server Error',
                'message' => 'Failed to create user',
            ], 500);
        }
    }

    public function updatePassword(UpdatePasswordRequest $request, $id): JsonResponse
    {
        try {
            $user = $this->service->updatePassword($id, $request->validated('password'));

            return response()->json(new UserResource($user), 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Not Found',
                'message' => 'User not found',
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Updating password failed: '.$e->getMessage(), ['exception' => $e]);

            return response()->json([
                'error' => 'Internal Server Error',
                'message' => 'Failed to update password',
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $this->service->deleteUser($id);

            return response()->json(['message' => 'User deleted successfully'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Not Found',
                'message' => 'User not found',
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Deleting user failed: '.$e->getMessage(), ['exception' => $e]);

            return response()->json([
                'error' => 'Internal Server Error',
                'message' => 'Failed to delete user',
            ], 500);
        }
    }

    public function update(UpdateUserRequest $request, $id): JsonResponse
    {
        try {
            // The validated() method returns only the fields defined in UpdateUserRequest rules
            $user = $this->service->updateUser($id, $request->validated());

            // Return updated user formatted exactly like your list (frontend expects this)
            return response()->json(new UserResource($user), 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Not Found',
                'message' => 'User not found',
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Updating user failed: '.$e->getMessage(), ['exception' => $e]);

            return response()->json([
                'error' => 'Internal Server Error',
                'message' => 'Failed to update user',
            ], 500);
        }
    }
}
