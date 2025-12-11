<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('PackageItem', function (Blueprint $table) {
            $table->id();
            $table->foreignId('packageId')->constrained('Package')->onDelete('cascade');
            $table->foreignId('productId')->constrained('Product')->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('PackageItem');
    }
};
