<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BacType extends Model
{
    protected $table = 'bac_type';

    public $timestamps = false;

    protected $fillable = [
        'nature',
        'capacite',
        'variante',
        'matiere',
        'color',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function commandes()
    {
        return $this->hasMany(Bac::class, 'bac_type_id');
    }

    public function stockSummary()
    {
        return $this->hasOne(StockSummaryBac::class, 'bac_type_id');
    }
}
