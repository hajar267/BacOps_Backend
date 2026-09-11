<?php
// database/migrations/xxxx_xx_xx_add_decharge_id_to_installation_sessions_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('installation_sessions', function (Blueprint $table) {
            $table->foreignId('decharge_id')
                ->nullable()
                ->after('id')
                ->constrained('decharges')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('installation_sessions', function (Blueprint $table) {
            $table->dropConstrainedForeignId('decharge_id');
        });
    }
};