<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Prefecture extends Model
{
    protected $fillable = ['ville_id', 'name'];

    public function ville(): BelongsTo
    {
        return $this->belongsTo(Ville::class);
    }

    public function arrondissements(): HasMany
    {
        return $this->hasMany(Arrondissement::class);
    }
}
