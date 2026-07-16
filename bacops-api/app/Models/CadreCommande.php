<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CadreCommande extends Model
{
    protected $table = 'cadre_commande';

    const UPDATED_AT = null;

    protected $fillable = [
        'label',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function commandes()
    {
        return $this->hasMany(Commande::class, 'cadre_commande_id');
    }
}
