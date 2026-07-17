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
        Schema::create('bac_has_rfid', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bac_id')->constrained('bacs');
            $table->foreignId('rfid_id')->constrained('rfids');
            $table->foreignId('assigned_by')->constrained('users');
            $table->timestamp('assigned_at');
            $table->timestamp('unassigned_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bac_has_rfid');
    }
};
