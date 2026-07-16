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
    Schema::create('commandes', function (Blueprint $table) {
        $table->id();

        $table->foreignId('cadre_commande_id')
              ->constrained('cadre_commande');

        $table->string('fournisseur')->nullable();

        $table->decimal('price', 10, 2)->nullable();

        $table->integer('quantite')->nullable();

        $table->text('commentaire')->nullable();

        $table->foreignId('added_by')
              ->constrained('users');

        $table->timestamp('created_at')->useCurrent();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};
