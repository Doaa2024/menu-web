<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Imports the menu data captured in seeders/data/menu_dump.json
 * (exported from the original local MySQL database). Inserts in
 * FK-safe order, preserving original ids, and is idempotent.
 *
 * Run against the deployed DB with:  php artisan db:seed --class=ProductionDataSeeder --force
 */
class ProductionDataSeeder extends Seeder
{
    public function run(): void
    {
        // Only import into an empty database, so data added later is never overwritten.
        if (DB::table('restaurants')->count() > 0) {
            $this->command->info('Menu data already present, skipping import.');

            return;
        }

        $path = database_path('seeders/data/menu_dump.json');
        $data = json_decode(file_get_contents($path), true);

        // Parent-first insert to satisfy foreign keys.
        foreach (['restaurants', 'categories', 'subcategories', 'products'] as $table) {
            if (! empty($data[$table])) {
                foreach (array_chunk($data[$table], 100) as $chunk) {
                    DB::table($table)->insert($chunk);
                }
            }
        }

        // On Postgres, advance each identity sequence past the inserted ids.
        if (DB::getDriverName() === 'pgsql') {
            foreach (['restaurants', 'categories', 'subcategories', 'products'] as $table) {
                $max = DB::table($table)->max('id');
                if ($max) {
                    DB::statement("SELECT setval(pg_get_serial_sequence('{$table}', 'id'), {$max})");
                }
            }
        }

        $this->command->info('Imported menu data from menu_dump.json.');
    }
}
