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
Schema::table('arrondissements', function (Blueprint $table) {
    $table->dropForeign(['prefecture_ville_id']);
    $table->dropColumn('prefecture_ville_id');

    $table->foreignId('ville_id')->after('id')->constrained()->cascadeOnDelete();
    $table->foreignId('prefecture_id')->nullable()->after('ville_id')->constrained()->nullOnDelete();
});    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('arrondissements');
    }
};
