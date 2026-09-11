<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Arrondissement extends Model
{
    protected $fillable = ['ville_id', 'prefecture_id', 'name'];

    public function ville(): BelongsTo
    {
        return $this->belongsTo(Ville::class);
    }

    public function prefecture(): BelongsTo
    {
        return $this->belongsTo(Prefecture::class);
    }
}
