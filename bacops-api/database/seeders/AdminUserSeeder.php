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
                'password' => Hash::make(env('ADMIN_PASSWORD', 'change-me')), 
                'is_active' => true,
                'role_id' => $adminRole->id,
            ],
        );
    }
}
