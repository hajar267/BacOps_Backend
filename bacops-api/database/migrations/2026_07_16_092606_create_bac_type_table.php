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
        Schema::create('bac_type', function (Blueprint $table) {
            $table->id();
            $table->string('nature', 100);
            $table->string('capacite', 50)->nullable();
            $table->string('variante', 50)->nullable();
            $table->string('matiere', 50)->nullable();
            $table->string('color', 50)->nullable();
            $table->boolean('is_active')->default(true);

            $table->unique(['nature', 'capacite', 'matiere', 'color', 'variante'], 'bac_type_unique_combo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bac_type');
    }
};
