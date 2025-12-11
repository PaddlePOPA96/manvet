<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('PromotionProduct', function (Blueprint $table) {
            $table->id();
            $table->foreignId('promotionId')->constrained('Promotion')->onDelete('cascade');
            $table->foreignId('productId')->constrained('Product')->onDelete('cascade');
            $table->decimal('eventPrice', 10, 2);
            $table->timestamps();

            $table->unique(['promotionId', 'productId']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('PromotionProduct');
    }
};
