<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('Transaction', function (Blueprint $table) {
            $table->id();
            $table->foreignId('userId')->constrained('User')->onDelete('cascade');
            $table->timestamp('date');
            $table->decimal('totalAmount', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Transaction');
    }
};
