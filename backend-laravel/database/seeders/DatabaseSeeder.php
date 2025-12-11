<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Roles
        $roles = ['admin', 'superadmin', 'user', 'guest'];
        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName]);
        }

        // 2. Admin User
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            User::firstOrCreate(
                ['email' => 'admin@vetpicurean.com'],
                [
                    'password' => Hash::make('admin123'),
                    'roleId' => $adminRole->id
                ]
            );
        }

        // 3. Categories (Optional, nice to have)
        $categories = ['Makanan Kucing', 'Makanan Anjing', 'Aksesoris', 'Obat-obatan', 'Jasa'];
        foreach ($categories as $cat) {
            Category::firstOrCreate(['name' => $cat]);
        }
    }
}
