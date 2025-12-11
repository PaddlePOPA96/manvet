<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\StockMutation;
use App\Models\Product;

class ResetTransactionData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'data:reset-transactions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset all transaction history, stock mutations, and set all product stock to 0';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🗑️  Starting database cleanup...');

        DB::transaction(function () {
            // Delete all transaction items first (foreign key constraint)
            $itemCount = TransactionItem::count();
            TransactionItem::truncate();
            $this->info("✅ Deleted {$itemCount} transaction items");

            // Delete all transactions
            $txCount = Transaction::count();
            Transaction::truncate();
            $this->info("✅ Deleted {$txCount} transactions");

            // Delete all stock mutations
            $mutationCount = StockMutation::count();
            StockMutation::truncate();
            $this->info("✅ Deleted {$mutationCount} stock mutations");

            // Reset all product stock to 0
            $productCount = Product::count();
            Product::query()->update(['stock' => 0]);
            $this->info("✅ Reset stock to 0 for {$productCount} products");
        });

        $this->info('');
        $this->info('🎉 Database cleanup completed successfully!');
        $this->info('💡 Run: php artisan db:seed --class=TransactionHistorySeeder to populate test data');

        return Command::SUCCESS;
    }
}
