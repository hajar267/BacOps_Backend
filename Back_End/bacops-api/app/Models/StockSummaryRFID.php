<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockSummaryRFID extends Model
{
    protected $table = 'stock_summary_rfid';

    const CREATED_AT = null; // Prisma schema only has updatedAt

    protected $fillable = ['total', 'disponible', 'en_service', 'perdu'];
}