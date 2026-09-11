<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use SoftDeletes;

    protected $fillable = [
        'username', 'email', 'first_name', 'last_name',
        'is_active', 'password', 'role_id',
    ];

    protected $hidden = ['password']; // never serialize this — like your controller excluding password

    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
    ];

    public $timestamps = false; // matches your schema — no updated_at on users

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    // Required by JWTSubject interface — this is what gets encoded in the token
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    // Custom claims — this is your tokenPayload equivalent
    public function getJWTCustomClaims()
    {
        return [
            'username' => $this->username,
            'role' => [
                'name' => $this->role->name,
                'permissions' => $this->role->permissions ?? [],
            ],
        ];
    }
}
