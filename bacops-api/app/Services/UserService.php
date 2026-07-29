<?php

// app/Services/UserService.php

namespace App\Services;

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function getAllUsers()
    {
        return User::with('role')->orderBy('id', 'asc')->get();
    }

    public function updateUser(int $id, array $data): User
    {
        $user = User::findOrFail($id);

        $updateData = [];

        // Map frontend camelCase payload to backend snake_case columns
        if (array_key_exists('firstName', $data)) {
            $updateData['first_name'] = $data['firstName'];
        }

        if (array_key_exists('lastName', $data)) {
            $updateData['last_name'] = $data['lastName'];
        }

        if (array_key_exists('email', $data)) {
            $updateData['email'] = $data['email'];
        }

        if (array_key_exists('active', $data)) {
            $updateData['is_active'] = $data['active'];
        }

        // Find the role ID based on the roleName sent from the frontend
        if (array_key_exists('roleName', $data)) {
            $role = Role::where('name', $data['roleName'])->first();
            if ($role) {
                $updateData['role_id'] = $role->id;
            }
        }

        // Update the user if there is data to update
        if (! empty($updateData)) {
            $user->update($updateData);
        }

        // Return the fresh user instance with the loaded role relation
        return $user->load('role');
    }

    public function createUser(array $data): User
    {
        $role = Role::where('name', $data['roleName'])->firstOrFail();

        $user = User::create([
            'username' => $data['firstName'].$data['lastName'],
            'first_name' => $data['firstName'],
            'last_name' => $data['lastName'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role_id' => $role->id,
            'is_active' => true,
        ]);

        return $user->load('role');
    }

    public function deleteUser(int $id): User
    {
        $user = User::findOrFail($id);
        $user->delete();

        return $user->load('role');
    }
}
