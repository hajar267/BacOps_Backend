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
        Schema::create('prefecture_villes', function (Blueprint $table) {
            $table->id();
            $table->string('prefecture');
            $table->string('ville');
            $table->timestamps();

            $table->unique(['prefecture', 'ville']);
            $table->index('ville');
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prefecture_villes');
    }
};
