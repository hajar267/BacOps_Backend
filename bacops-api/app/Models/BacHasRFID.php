<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BacHasRFID extends Model
{
    protected $table = 'bac_has_rfid';

    public $timestamps = false;

    protected $fillable = [
        'bac_id',
        'rfid_id',
        'assigned_by',
        'assigned_at',
        'unassigned_at',
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
        'unassigned_at' => 'datetime',
    ];

    public function bac()
    {
        return $this->belongsTo(Bac::class, 'bac_id');
    }

    public function rfid()
    {
        return $this->belongsTo(RFID::class, 'rfid_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }
}
