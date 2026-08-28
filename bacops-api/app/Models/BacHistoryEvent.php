<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BacHistoryEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'bac_id',
        'rfid_id',
        'installation_id',
        'action',
        'previous_state',
        'new_state',
        'agent_id',
        'occurred_at',
    ];

    protected $casts = [
        'occurred_at' => 'datetime',
    ];

    public function bac(): BelongsTo
    {
        return $this->belongsTo(Bac::class);
    }

    public function rfid(): BelongsTo
    {
        return $this->belongsTo(RFID::class, 'rfid_id');
    }

    public function installation(): BelongsTo
    {
        return $this->belongsTo(Installation::class);
    }

    public function agent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'agent_id');
    }
}