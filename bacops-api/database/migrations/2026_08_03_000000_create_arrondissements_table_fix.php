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
        if (Schema::hasTable('arrondissements')) {
            return;
        }

        Schema::create('arrondissements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ville_id')->constrained('villes')->cascadeOnDelete();
            $table->foreignId('prefecture_id')->nullable()->constrained('prefectures')->nullOnDelete();
            $table->string('name');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('arrondissements');
    }
};
