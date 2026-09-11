<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bacs', function (Blueprint $table) {
            $table->dropUnique(['serial_number']);
            $table->unique(['serial_number', 'bac_type_id']);
        });
    }

    public function down(): void
    {
        Schema::table('bacs', function (Blueprint $table) {
            $table->dropUnique(['serial_number', 'bac_type_id']);
            $table->unique('serial_number');
        });
    }
};
