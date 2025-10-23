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
        Schema::table('meal_entries', function (Blueprint $table) {
            // Index composite pour les requêtes les plus fréquentes
            $table->index(['user_id', 'date', 'person'], 'meal_entries_user_date_person_idx');
            
            // Index pour les stats par mois
            $table->index(['user_id', 'date'], 'meal_entries_user_date_idx');
            
            // Index pour les requêtes par personne
            $table->index(['user_id', 'person'], 'meal_entries_user_person_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('meal_entries', function (Blueprint $table) {
            $table->dropIndex('meal_entries_user_date_person_idx');
            $table->dropIndex('meal_entries_user_date_idx');
            $table->dropIndex('meal_entries_user_person_idx');
        });
    }
};
