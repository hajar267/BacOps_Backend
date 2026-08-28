<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bac_history_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bac_id')->constrained('bacs')->cascadeOnDelete();
            $table->foreignId('rfid_id')->nullable()->constrained('rfids')->nullOnDelete();
            $table->foreignId('installation_id')->nullable()->constrained('installations')->nullOnDelete();
            $table->string('action');
            $table->string('previous_state')->nullable();
            $table->string('new_state');
            $table->foreignId('agent_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('occurred_at');
            $table->timestamps();

            $table->index(['bac_id', 'occurred_at']);
            $table->index(['action', 'occurred_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bac_history_events');
    }
};
