<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('StockMutation', function (Blueprint $table) {
            $table->id();
            $table->foreignId('productId')->constrained('Product')->onDelete('cascade');
            $table->string('type'); // IN or OUT
            $table->string('condition');
            $table->integer('quantity');
            $table->timestamp('date');
            $table->string('reseller')->nullable();
            $table->timestamp('productionDate')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('StockMutation');
    }
};
