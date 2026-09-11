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
    Schema::create('stock_summary_bac', function (Blueprint $table) {
        $table->id();

        $table->foreignId('bac_type_id')
              ->unique()
              ->constrained('bac_type');

        $table->integer('total')->default(0);

        $table->integer('en_stock')->default(0);

        $table->integer('en_service')->default(0);

        $table->integer('en_reparation')->default(0);

        $table->integer('perdu')->default(0);

        $table->integer('mis_en_rebut')->default(0);

        $table->timestamp('updated_at')
              ->useCurrent()
              ->useCurrentOnUpdate();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_summary_bac');
    }
};
