<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('pvs', 'arrondissement_id')) {
            return;
        }

        Schema::table('pvs', function (Blueprint $table) {
            $table->unsignedBigInteger('arrondissement_id')
                ->nullable()
                ->after('filter_matiere');
            $table->foreign('arrondissement_id')
                ->references('id')
                ->on('arrondissements')
                ->nullOnDelete();
            $table->index('arrondissement_id');
        });
    }

    public function down(): void
    {
        Schema::table('pvs', function (Blueprint $table) {
            $table->dropForeign(['arrondissement_id']);
            $table->dropIndex(['arrondissement_id']);
            $table->dropColumn('arrondissement_id');
        });
    }
};
