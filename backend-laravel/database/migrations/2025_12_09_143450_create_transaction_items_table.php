<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('TransactionItem', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transactionId')->constrained('Transaction')->onDelete('cascade');
            $table->foreignId('productId')->nullable()->constrained('Product')->onDelete('set null');
            $table->foreignId('packageId')->nullable()->constrained('Package')->onDelete('set null');
            $table->string('type')->default('ITEM');
            $table->integer('qty')->default(1);
            $table->decimal('basePrice', 10, 2)->default(0);
            $table->decimal('price', 10, 2)->default(0);
            $table->decimal('cost', 10, 2)->default(0);
            $table->decimal('discountPerUnit', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('TransactionItem');
    }
};
