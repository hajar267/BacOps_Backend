<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = ['name', 'permissions'];

    protected $casts = [
        'permissions' => 'array', // auto JSON encode/decode, like Prisma's Json type
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}