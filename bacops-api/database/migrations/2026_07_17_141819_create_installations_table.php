<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('installations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bac_id')->constrained('bacs');
            $table->foreignId('rfid_id')->constrained('rfids');
            $table->foreignId('installation_session_id')->constrained('installation_sessions');
            $table->double('location_lat')->nullable();
            $table->double('location_lng')->nullable();
            $table->timestamp('uninstalled_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('installations');
    }
};
