<?php
// app/Models/Attachment.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    protected $table = 'attachments';

    const UPDATED_AT = null;

    protected $fillable = [
        'ref_type',
        'ref_id',
        'type',
        'url',
        'uploaded_by',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
