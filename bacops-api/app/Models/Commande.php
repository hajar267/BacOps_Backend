<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    protected $table = 'commandes';

    const UPDATED_AT = null;

    protected $fillable = [
        'cadre_commande_id',
        'fournisseur_id',
        'price',
        'quantite',
        'commentaire',
        'added_by',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'added_by');
    }

    public function cadreCommande()
    {
        return $this->belongsTo(CadreCommande::class, 'cadre_commande_id');
    }

    public function bacs()
    {
        return $this->hasMany(Bac::class, 'commande_id');
    }

    public function fournisseur()
    {
        return $this->belongsTo(Supplier::class, 'fournisseur_id');
    }
}
