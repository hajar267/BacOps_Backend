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
    Schema::create('bacs', function (Blueprint $table) {
        $table->id();

        $table->string('serial_number')->unique();

        $table->string('status');

        $table->foreignId('bac_type_id')
              ->constrained('bac_type');

        $table->foreignId('commande_id')
              ->constrained('commandes');

        $table->foreignId('added_by')
              ->constrained('users');

        $table->foreignId('updated_by')
              ->nullable()
              ->constrained('users');

        $table->text('commentaire')->nullable();

        $table->timestamp('deleted_at')->nullable();

        $table->timestamp('created_at')->useCurrent();

        $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bacs');
    }
};
