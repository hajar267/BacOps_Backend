<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class commandes_rfid extends Model
{
    protected $table = 'commandes_rfid';

    const UPDATED_AT = null; // Prisma schema only has createdAt, no updatedAt

    protected $fillable = ['quantite', 'commentaire', 'added_by'];

    public function user()
    {
        return $this->belongsTo(User::class, 'added_by');
    }

    public function rfids()
    {
        return $this->hasMany(RFID::class, 'commande_id');
    }
}