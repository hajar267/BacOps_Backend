<?php

namespace Tests\Feature;

use App\Models\Arrondissement;
use App\Models\Prefecture;
use App\Models\Role;
use App\Models\Supplier;
use App\Models\User;
use App\Models\Ville;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class ApiCrudAndAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_without_permission_cannot_read_admin_resources(): void
    {
        $user = $this->makeUser(['permissions' => []]);

        $this->withToken($this->accessToken($user))
            ->getJson('/api/users')
            ->assertForbidden();
    }

    public function test_user_without_token_cannot_access_protected_resources(): void
    {
        $this->getJson('/api/users')->assertUnauthorized();
        $this->getJson('/api/dashboard/stats')->assertUnauthorized();
        $this->getJson('/api/pv')->assertUnauthorized();
    }

    public function test_locations_can_be_created_and_listed(): void
    {
        $user = $this->makeUser();
        $token = $this->accessToken($user);

        $ville = $this->withToken($token)
            ->postJson('/api/villes', ['name' => 'Rabat'])
            ->assertCreated()
            ->json('data');

        $prefecture = $this->withToken($token)
            ->postJson('/api/prefectures', [
                'ville_id' => $ville['id'],
                'name' => 'Rabat Prefecture',
            ])
            ->assertCreated()
            ->json('data');

        $this->withToken($token)
            ->postJson('/api/arrondissements', [
                'ville_id' => $ville['id'],
                'prefecture_id' => $prefecture['id'],
                'name' => 'Agdal',
            ])
            ->assertCreated();

        $this->withToken($token)
            ->getJson('/api/villes')
            ->assertOk()
            ->assertJsonFragment(['name' => 'Rabat']);
    }

    public function test_location_cannot_be_deleted_when_it_has_children(): void
    {
        $user = $this->makeUser();
        $ville = Ville::create(['name' => 'Rabat']);
        Prefecture::create(['ville_id' => $ville->id, 'name' => 'Rabat Prefecture']);

        $this->withToken($this->accessToken($user))
            ->deleteJson("/api/villes/{$ville->id}")
            ->assertUnprocessable();
    }

    public function test_roles_can_be_created_and_updated(): void
    {
        $user = $this->makeUser();
        $token = $this->accessToken($user);

        $role = $this->withToken($token)
            ->postJson('/api/roles', [
                'name' => 'magasin-test',
                'permissions' => ['stock:read'],
            ])
            ->assertCreated()
            ->json('data');

        $this->withToken($token)
            ->putJson("/api/roles/{$role['id']}", [
                'name' => 'magasin-updated',
                'permissions' => ['stock:read', 'stock:create'],
            ])
            ->assertOk()
            ->assertJsonPath('data.name', 'magasin-updated');
    }

    public function test_supplier_can_be_created_updated_and_deleted(): void
    {
        $user = $this->makeUser();
        $token = $this->accessToken($user);

        $supplier = $this->withToken($token)
            ->postJson('/api/suppliers', ['nom' => 'Supplier Test'])
            ->assertCreated()
            ->json('supplier');

        $this->withToken($token)
            ->putJson("/api/suppliers/{$supplier['id']}", ['nom' => 'Supplier Updated'])
            ->assertOk()
            ->assertJsonPath('supplier.nom', 'Supplier Updated');

        $this->withToken($token)
            ->deleteJson("/api/suppliers/{$supplier['id']}")
            ->assertNoContent();

        $this->assertDatabaseMissing('suppliers', ['id' => $supplier['id']]);
    }

    private function makeUser(array $attributes = []): User
    {
        $role = Role::firstOrCreate(
            ['name' => 'admin'],
            ['permissions' => ['*', 'admin:read', 'admin:create', 'admin:update']]
        );

        if (array_key_exists('permissions', $attributes)) {
            $role->update(['permissions' => $attributes['permissions']]);
            unset($attributes['permissions']);
        }

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