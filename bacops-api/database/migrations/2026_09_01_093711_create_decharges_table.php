<?php
// database/migrations/xxxx_xx_xx_create_decharges_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('decharges', function (Blueprint $table) {
            $table->id();

            $table->string('nom');
            $table->string('prenom');
            $table->string('cin')->nullable();
            $table->string('telephone');

            $table->foreignId('signature_beneficiaire_attachment_id')
                ->nullable()
                ->constrained('attachments')
                ->nullOnDelete();

            $table->foreignId('signature_agent_attachment_id')
                ->nullable()
                ->constrained('attachments')
                ->nullOnDelete();

            $table->foreignId('created_by')->constrained('users');
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('decharges');
    }
};
