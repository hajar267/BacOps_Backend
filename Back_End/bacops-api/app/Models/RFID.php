<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RFID extends Model
{
    use SoftDeletes;

    protected $table = 'rfids';

    protected $fillable = [
        'rfid_code',
        'status',
        'commande_id',
        'added_by',
        'commentaire',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'added_by');
    }

    public function commande()
    {
        return $this->belongsTo(commandes_rfid::class, 'commande_id');
    }

    public function bacLinks()
    {
        return $this->hasMany(BacHasRFID::class, 'rfid_id');
    }
}
