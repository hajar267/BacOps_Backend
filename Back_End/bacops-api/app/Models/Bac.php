<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bac extends Model
{
    use SoftDeletes;

    protected $table = 'bacs';

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';
    const DELETED_AT = 'deleted_at';

    protected $fillable = [
        'serial_number',
        'status',
        'bac_type_id',
        'commande_id',
        'added_by',
        'updated_by',
        'commentaire',
    ];

    public function bacType()
    {
        return $this->belongsTo(BacType::class, 'bac_type_id');
    }

    public function commande()
    {
        return $this->belongsTo(Commande::class, 'commande_id');
    }

    public function addedByUser()
    {
        return $this->belongsTo(User::class, 'added_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function rfids()
    {
        return $this->hasMany(BacHasRFID::class, 'bac_id');
    }

    public function installations()
    {
        return $this->hasMany(Installation::class, 'bac_id');
    }

    public function reports()
    {
        return $this->hasMany(Report::class, 'bac_id');
    }
}
