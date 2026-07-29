<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Arrondissement extends Model
{
    protected $fillable = ['prefecture_ville_id', 'name'];

    public function prefectureVille(): BelongsTo
    {
        return $this->belongsTo(PrefectureVille::class);
    }
}
