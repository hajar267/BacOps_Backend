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
    Schema::create('cadre_commande', function (Blueprint $table) {
        $table->id();

        $table->string('label')->unique();

        $table->boolean('is_active')->default(true);

        $table->timestamp('created_at')->useCurrent();
    });    
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cadre_commande');
    }
};
