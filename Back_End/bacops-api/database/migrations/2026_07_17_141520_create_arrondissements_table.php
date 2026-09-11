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
        // Make migration idempotent and safe: create table if missing,
        // otherwise add missing columns and remove legacy ones if present.
        if (!Schema::hasTable('arrondissements')) {
            Schema::create('arrondissements', function (Blueprint $table) {
                $table->id();
                $table->foreignId('ville_id')->constrained()->cascadeOnDelete();
                $table->foreignId('prefecture_id')->nullable()->constrained('prefectures')->nullOnDelete();
                $table->string('name');
                $table->timestamps();
            });
            return;
        }

        // Table exists: ensure columns are present/removed as needed.
        if (Schema::hasColumn('arrondissements', 'prefecture_ville_id')) {
            Schema::table('arrondissements', function (Blueprint $table) {
                // drop foreign if exists (silently ignore if not present)
                try {
                    $table->dropForeign(['prefecture_ville_id']);
                } catch (\Throwable $e) {
                    // ignore
                }
                $table->dropColumn('prefecture_ville_id');
            });
        }

        if (!Schema::hasColumn('arrondissements', 'ville_id')) {
            Schema::table('arrondissements', function (Blueprint $table) {
                $table->foreignId('ville_id')->after('id')->constrained()->cascadeOnDelete();
            });
        }

        if (!Schema::hasColumn('arrondissements', 'prefecture_id')) {
            Schema::table('arrondissements', function (Blueprint $table) {
                $table->foreignId('prefecture_id')->nullable()->after('ville_id')->constrained('prefectures')->nullOnDelete();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('arrondissements');
    }
};
