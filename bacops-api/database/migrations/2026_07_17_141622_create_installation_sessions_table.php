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
        Schema::create('installation_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agent_id')->constrained('users');
            $table->string('num_point')->nullable();
            $table->double('location_lat')->nullable();
            $table->double('location_lng')->nullable();
            $table->string('address')->nullable();
            $table->foreignId('arrondissement_id')->nullable()->constrained();
            $table->timestamp('installed_at');
        });
    }

    /**
     * Reverse the migrations.
     */

    public function down(): void
    {
        Schema::dropIfExists('installation_sessions');
    }
};
