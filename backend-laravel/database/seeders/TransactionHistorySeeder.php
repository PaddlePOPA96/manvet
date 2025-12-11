<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\StockMutation;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\User;
use Carbon\Carbon;

class TransactionHistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🌱 Starting to seed transaction history...');

        // Get first user for transactions
        $userId = User::first()->id;

        // Get all products
        $products = Product::all();

        if ($products->isEmpty()) {
            $this->command->error('❌ No products found! Please seed products first.');
            return;
        }

        // Seed data for December 1-11, 2025
        $startDate = Carbon::create(2025, 12, 1);
        $endDate = Carbon::create(2025, 12, 11);

        $currentDate = $startDate->copy();

        while ($currentDate->lte($endDate)) {
            $this->command->info("📅 Processing {$currentDate->format('Y-m-d')}...");

            // Morning: Stock IN (purchases/production) - every 2-3 days
            if ($currentDate->day % 2 === 0) {
                $this->createStockInMutations($products, $currentDate->copy()->setTime(9, 0));
            }

            // Throughout the day: Sales transactions (2-5 per day)
            $numTransactions = rand(2, 5);
            for ($i = 0; $i < $numTransactions; $i++) {
                $hour = rand(10, 19); // 10 AM to 7 PM
                $minute = rand(0, 59);
                $this->createSalesTransaction($products, $userId, $currentDate->copy()->setTime($hour, $minute));
            }

            // Evening: Occasional stock OUT (damage/expired) - randomly
            if (rand(1, 4) === 1) { // 25% chance
                $this->createStockOutMutations($products, $currentDate->copy()->setTime(20, 0));
            }

            $currentDate->addDay();
        }

        $this->command->info('');
        $this->command->info('🎉 Transaction history seeding completed!');
        $this->command->info('📊 Summary:');
        $this->command->info('   - Transactions: ' . Transaction::count());
        $this->command->info('   - Transaction Items: ' . TransactionItem::count());
        $this->command->info('   - Stock Mutations: ' . StockMutation::count());
        $this->command->info('   - Products with stock: ' . Product::where('stock', '>', 0)->count());
    }

    /**
     * Create stock IN mutations (purchases/production)
     */
    private function createStockInMutations($products, $date)
    {
        // Randomly select 5-10 products to restock
        $productsToRestock = $products->random(rand(5, 10));

        foreach ($productsToRestock as $product) {
            $quantity = rand(10, 50); // Random quantity between 10-50
            $condition = rand(1, 2) === 1 ? 'PURCHASE' : 'PRODUCTION';

            StockMutation::create([
                'productId' => $product->id,
                'type' => 'IN',
                'condition' => $condition,
                'quantity' => $quantity,
                'date' => $date,
            ]);

            // Update product stock
            $product->increment('stock', $quantity);
        }
    }

    /**
     * Create stock OUT mutations (damage/expired)
     */
    private function createStockOutMutations($products, $date)
    {
        // Randomly select 1-3 products with damage/expiry
        $productsWithIssues = $products->where('stock', '>', 0)->random(min(rand(1, 3), $products->where('stock', '>', 0)->count()));

        foreach ($productsWithIssues as $product) {
            $maxQty = min($product->stock, 5); // Max 5 units damaged/expired
            if ($maxQty <= 0)
                continue;

            $quantity = rand(1, $maxQty);
            $condition = rand(1, 2) === 1 ? 'DAMAGE' : 'EXPIRED';

            StockMutation::create([
                'productId' => $product->id,
                'type' => 'OUT',
                'condition' => $condition,
                'quantity' => $quantity,
                'date' => $date,
            ]);

            // Update product stock
            $product->decrement('stock', $quantity);
        }
    }

    /**
     * Create a sales transaction
     */
    private function createSalesTransaction($products, $userId, $date)
    {
        // Select 1-4 random products that have stock
        $availableProducts = $products->where('stock', '>', 0);

        if ($availableProducts->isEmpty()) {
            return; // Skip if no products available
        }

        $numItems = rand(1, min(4, $availableProducts->count()));
        $selectedProducts = $availableProducts->random($numItems);

        $totalAmount = 0;
        $items = [];

        foreach ($selectedProducts as $product) {
            $maxQty = min($product->stock, 5); // Max 5 units per transaction
            if ($maxQty <= 0)
                continue;

            $qty = rand(1, $maxQty);
            $price = floatval($product->price);
            $cost = floatval($product->cost);
            $discount = rand(0, 1) === 1 ? rand(0, 5000) : 0; // Random discount 0-5000

            $items[] = [
                'productId' => $product->id,
                'qty' => $qty,
                'price' => $price,
                'cost' => $cost,
                'discount' => $discount,
            ];

            $totalAmount += ($price * $qty) - ($discount * $qty);

            // Update product stock
            $product->decrement('stock', $qty);

            // Create stock mutation for this sale
            StockMutation::create([
                'productId' => $product->id,
                'type' => 'OUT',
                'condition' => 'SALE',
                'quantity' => $qty,
                'date' => $date,
            ]);
        }

        if (empty($items)) {
            return; // Skip if no valid items
        }

        // Create transaction
        $transaction = Transaction::create([
            'userId' => $userId,
            'date' => $date,
            'totalAmount' => $totalAmount,
        ]);

        // Create transaction items
        foreach ($items as $item) {
            TransactionItem::create([
                'transactionId' => $transaction->id,
                'productId' => $item['productId'],
                'packageId' => null,
                'type' => 'ITEM',
                'qty' => $item['qty'],
                'basePrice' => $item['price'],
                'price' => $item['price'],
                'cost' => $item['cost'],
                'discountPerUnit' => $item['discount'],
            ]);
        }
    }
}
