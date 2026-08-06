<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pvs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->constrained('users');
            $table->string('contract_num');
            $table->string('pv_number')->unique();
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->string('filter_capacite')->nullable();
            $table->string('filter_matiere')->nullable();
            $table->string('signed_pdf_url')->nullable();
            $table->timestamp('signed_at')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['admin_id', 'contract_num', 'start_date', 'end_date', 'filter_capacite', 'filter_matiere'], 'pvs_dedupe_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pvs');
    }
};