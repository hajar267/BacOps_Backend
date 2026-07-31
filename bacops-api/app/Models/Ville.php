<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ville extends Model
{
    protected $fillable = ['name'];

    public function prefectures(): HasMany
    {
        return $this->hasMany(Prefecture::class);
    }

    public function arrondissements(): HasMany
    {
        return $this->hasMany(Arrondissement::class);
    }
}