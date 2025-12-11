<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('Transaction', function (Blueprint $table) {
            // Index on date column for faster date range queries
            $table->index('date', 'idx_transaction_date');
        });

        Schema::table('TransactionItem', function (Blueprint $table) {
            // Index on transactionId for faster joins
            $table->index('transactionId', 'idx_transactionitem_transactionid');
            // Index on type for faster filtering
            $table->index('type', 'idx_transactionitem_type');
            // Composite index for common query pattern
            $table->index(['transactionId', 'type'], 'idx_transactionitem_transaction_type');
        });

        Schema::table('StockMutation', function (Blueprint $table) {
            // Index on date for faster date range queries
            $table->index('date', 'idx_stockmutation_date');
            // Index on productId for faster lookups
            $table->index('productId', 'idx_stockmutation_productid');
            // Index on type for filtering
            $table->index('type', 'idx_stockmutation_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('Transaction', function (Blueprint $table) {
            $table->dropIndex('idx_transaction_date');
        });

        Schema::table('TransactionItem', function (Blueprint $table) {
            $table->dropIndex('idx_transactionitem_transactionid');
            $table->dropIndex('idx_transactionitem_type');
            $table->dropIndex('idx_transactionitem_transaction_type');
        });

        Schema::table('StockMutation', function (Blueprint $table) {
            $table->dropIndex('idx_stockmutation_date');
            $table->dropIndex('idx_stockmutation_productid');
            $table->dropIndex('idx_stockmutation_type');
        });
    }
};
