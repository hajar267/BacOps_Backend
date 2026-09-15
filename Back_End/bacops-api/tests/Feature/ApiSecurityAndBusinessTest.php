<?php

namespace Tests\Feature;

use App\Models\BacType;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class ApiSecurityAndBusinessTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_returns_access_and_refresh_tokens(): void
    {
        $user = $this->makeUser(['username' => 'admin']);

        $response = $this->postJson('/api/auth/login', [
            'username' => $user->username,
            'password' => 'password123',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['accessToken', 'refreshToken', 'user']);
    }

    public function test_refresh_token_cannot_access_protected_routes(): void
    {
        $user = $this->makeUser(['username' => 'admin']);
        $tokens = app(\App\Services\AuthService::class)->login('admin', 'password123');

        $this->withToken($tokens['refreshToken'])
            ->getJson('/api/users')
            ->assertUnauthorized();
    }

    public function test_user_update_regenerates_username_when_name_changes(): void
    {
        $user = $this->makeUser(['username' => 'jsmith']);
        $token = $this->accessToken($user);

        $this->withToken($token)
            ->putJson("/api/users/{$user->id}", [
                'firstName' => 'Jane',
                'lastName' => 'Doe',
                'email' => $user->email,
                'roleName' => 'admin',
                'active' => true,
            ])
            ->assertOk()
            ->assertJsonPath('username', 'jdoe');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'username' => 'jdoe',
        ]);
    }

    public function test_bac_type_can_be_reactivated(): void
    {
        $user = $this->makeUser(['username' => 'admin']);
        $bacType = BacType::create([
            'nature' => 'Bac roulant',
            'capacite' => '660 L',
            'matiere' => 'Plastique',
            'color' => 'Vert',
            'is_active' => false,
        ]);

        $this->withToken($this->accessToken($user))
            ->putJson("/api/bac-types/bac-types/{$bacType->id}", [
                'isActive' => true,
            ])
            ->assertOk()
            ->assertJsonPath('bacType.is_active', true);

        $this->assertDatabaseHas('bac_type', [
            'id' => $bacType->id,
            'is_active' => 1,
        ]);
    }

    public function test_signed_pdf_upload_requires_a_pdf_file(): void
    {
        Storage::fake('public');
        $user = $this->makeUser(['username' => 'admin']);

        $pv = \App\Models\PV::create([
            'admin_id' => $user->id,
            'contract_num' => 'contract',
            'pv_number' => 'PV-TEST-001',
        ]);

        $this->withToken($this->accessToken($user))
            ->postJson("/api/pv/{$pv->id}/signed", [
                'file' => UploadedFile::fake()->create('signed.txt', 10, 'text/plain'),
            ])
            ->assertUnprocessable();
    }

    private function makeUser(array $attributes = []): User
    {
        $role = Role::firstOrCreate(
            ['name' => 'admin'],
            ['permissions' => ['*', 'admin:read', 'admin:update', 'admin:create']]
        );

        return User::create(array_merge([
            'username' => 'testadmin',
            'email' => 'admin@example.com',
            'first_name' => 'Test',
            'last_name' => 'Admin',
            'is_active' => true,
            'password' => Hash::make('password123'),
            'role_id' => $role->id,
        ], $attributes));
    }

    private function accessToken(User $user): string
    {
        return (string) JWTAuth::claims(['type' => 'access'])->fromUser($user);
    }
}