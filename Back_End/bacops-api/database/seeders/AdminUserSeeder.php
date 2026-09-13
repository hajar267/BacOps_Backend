<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminPassword = env('ADMIN_PASSWORD');

        if (empty($adminPassword)) {
            throw new \RuntimeException(
                'ADMIN_PASSWORD must be set in .env before seeding.'
            );
        }

        if (strlen($adminPassword) < 8) {
            throw new \RuntimeException(
                'ADMIN_PASSWORD is too short. Use at least 8 characters.'
            );
        }

        $weakPasswords = ['change-me', 'password123', 'admin123', '12345678'];
        if (in_array(strtolower($adminPassword), $weakPasswords, true)) {
            throw new \RuntimeException(
                'ADMIN_PASSWORD is a known weak/placeholder value. Set a different password in .env.'
            );
        }

        $adminRole = Role::updateOrCreate(
            ['name' => 'admin'],
            ['permissions' => ['*']],
        );

        User::updateOrCreate(
            ['username' => env('ADMIN_USERNAME', 'admin')],
            [
                'email' => env('ADMIN_EMAIL', 'admin@example.com'),
                'first_name' => env('ADMIN_FIRST_NAME', 'System'),
                'last_name' => env('ADMIN_LAST_NAME', 'Administrator'),
                'password' => Hash::make($adminPassword),
                'is_active' => true,
                'role_id' => $adminRole->id,
            ],
        );
    }
}
