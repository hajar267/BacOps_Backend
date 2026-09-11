<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PrefectureVille extends Model
{
    protected $fillable = ['prefecture', 'ville'];

    public function arrondissements(): HasMany
    {
        return $this->hasMany(Arrondissement::class);
    }
}
