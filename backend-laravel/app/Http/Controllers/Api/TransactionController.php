<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function index()
    {
        $limit = request()->query('limit', 10);

        // Eager load all relationships including category to avoid N+1
        $transactions = Transaction::with([
            'items.product.category', // Eager load category!
            'items.package' => function ($query) {
                $query->with('products');
            }
        ])->orderBy('date', 'desc')->paginate($limit);

        // Transform collection using the helper
        $flatData = $transactions->getCollection()->flatMap(function ($tx) {
            return $this->flattenTransaction($tx);
        });

        // Return paginated response structure
        return response()->json([
            'data' => $flatData,
            'current_page' => $transactions->currentPage(),
            'last_page' => $transactions->lastPage(),
            'per_page' => $transactions->perPage(),
            'total' => $transactions->total(),
        ]);
    }

    public function store(\App\Http\Requests\StoreTransactionRequest $request)
    {
        $validated = $request->validated();

        return DB::transaction(function () use ($validated, $request) {
            $userId = $request->user()->id;

            // Calculate total
            $totalAmount = 0;
            foreach ($validated['items'] as $item) {
                $price = $item['price'];
                $qty = $item['qty'];
                $discount = $item['discount'] ?? 0;
                $totalAmount += ($price * $qty) - ($discount * $qty);
            }

            $transaction = Transaction::create([
                'userId' => $userId,
                'date' => $validated['date'],
                'totalAmount' => $totalAmount
            ]);

            foreach ($validated['items'] as $item) {
                TransactionItem::create([
                    'transactionId' => $transaction->id,
                    'productId' => $item['productId'] ?? null,
                    'packageId' => $item['packageId'] ?? null,
                    'type' => $item['type'],
                    'qty' => $item['qty'],
                    'basePrice' => $item['price'],
                    'price' => $item['price'],
                    'cost' => $item['cost'],
                    'discountPerUnit' => $item['discount'] ?? 0
                ]);

                // Handle Stock Deduction
                if ($item['type'] === 'ITEM' && !empty($item['productId'])) {
                    $product = \App\Models\Product::find($item['productId']);
                    if ($product) {
                        $product->decrement('stock', $item['qty']);
                        \App\Models\StockMutation::create([
                            'productId' => $product->id,
                            'type' => 'OUT',
                            'condition' => 'SALE',
                            'quantity' => $item['qty'],
                            'date' => $validated['date'],
                        ]);
                    }
                } elseif ($item['type'] === 'PACKAGE' && !empty($item['packageId'])) {
                    $package = \App\Models\Package::with('products')->find($item['packageId']);
                    if ($package) {
                        foreach ($package->products as $pkgProduct) {
                            $qtyToDeduct = $item['qty'] * $pkgProduct->pivot->quantity;
                            \App\Models\Product::where('id', $pkgProduct->id)->decrement('stock', $qtyToDeduct);

                            \App\Models\StockMutation::create([
                                'productId' => $pkgProduct->id,
                                'type' => 'OUT',
                                'condition' => 'SALE',
                                'quantity' => $qtyToDeduct,
                                'date' => $validated['date'],
                            ]);
                        }
                    }
                }
            }

            // Load relations and flatten
            $transaction->load([
                'items.product.category', // Eager load category
                'items.package.products'
            ]);

            // Return flat data for frontend append
            return response()->json([
                'data' => $this->flattenTransaction($transaction)
            ]);
        });
    }

    private function flattenTransaction($tx)
    {
        if ($tx->items->isEmpty()) {
            return [
                [
                    'id' => $tx->id,
                    'date' => $tx->date,
                    'totalAmount' => $tx->totalAmount,
                    'userId' => $tx->userId,
                    'itemId' => null,
                    'product' => null,
                    'type' => null,
                    'condition' => null,
                    'quantity' => null,
                    'price' => null,
                    'cost' => null,
                    'category' => null,
                ]
            ];
        }

        return $tx->items->map(function ($item) use ($tx) {
            $productName = $item->type === 'PACKAGE'
                ? ($item->package->name ?? 'Unknown Package')
                : ($item->product->name ?? 'Unknown Product');

            // Use eager loaded category instead of querying
            $category = $item->type === 'ITEM' && $item->product && $item->product->category
                ? $item->product->category->name
                : 'Package';

            return [
                'id' => $tx->id,
                'date' => $tx->date,
                'totalAmount' => $tx->totalAmount,
                'userId' => $tx->userId,
                'itemId' => $item->id,
                'product' => $productName,
                'type' => 'KELUAR', // OUT -> KELUAR
                'condition' => 'SALE', // Transactions are always SALE
                'quantity' => $item->qty, // Legacy frontend expects 'quantity'
                'price' => $item->price,
                'cost' => $item->cost,
                'category' => $category,
                'discountPerUnit' => $item->discountPerUnit
            ];
        });
    }
}
