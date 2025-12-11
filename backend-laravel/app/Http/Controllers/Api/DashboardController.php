<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\TransactionItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        // Create cache key based on date range
        $cacheKey = 'dashboard_stats_' . ($startDate ?? 'all') . '_' . ($endDate ?? 'now');

        // Cache for 30 seconds to reduce database load
        return Cache::remember($cacheKey, 30, function () use ($startDate, $endDate) {
            // 1. Stock Ready - Simple sum, no joins needed
            $stockReady = Product::sum('stock');

            // 2. Build base query for transactions
            $baseQuery = TransactionItem::query()
                ->join('Transaction', 'TransactionItem.transactionId', '=', 'Transaction.id')
                ->where('TransactionItem.type', 'ITEM');

            // Apply date filters
            if ($startDate) {
                $baseQuery->whereDate('Transaction.date', '>=', $startDate);
            }
            if ($endDate) {
                $baseQuery->whereDate('Transaction.date', '<=', $endDate);
            }

            // 3. Get stats in single query
            $stats = $baseQuery->select(
                DB::raw('SUM("TransactionItem"."qty") as qty_sold'),
                DB::raw('SUM(("TransactionItem"."price" * "TransactionItem"."qty") - (COALESCE("TransactionItem"."discountPerUnit", 0) * "TransactionItem"."qty")) as revenue'),
                DB::raw('SUM((("TransactionItem"."price" - "TransactionItem"."cost" - COALESCE("TransactionItem"."discountPerUnit", 0)) * "TransactionItem"."qty")) as profit')
            )->first();

            // 4. Chart Data - Use same base query for consistency
            $chartQuery = clone $baseQuery;
            $chartData = $chartQuery->select(
                DB::raw('DATE("Transaction"."date") as date'),
                DB::raw('SUM(("TransactionItem"."price" * "TransactionItem"."qty") - (COALESCE("TransactionItem"."discountPerUnit", 0) * "TransactionItem"."qty")) as revenue')
            )
                ->groupBy(DB::raw('DATE("Transaction"."date")'))
                ->orderBy('date', 'asc')
                ->get();

            return response()->json([
                'stock_ready' => (int) $stockReady,
                'qty_sold' => (int) ($stats->qty_sold ?? 0),
                'revenue' => (float) ($stats->revenue ?? 0),
                'profit' => (float) ($stats->profit ?? 0),
                'chart_data' => $chartData
            ]);
        });
    }
}
