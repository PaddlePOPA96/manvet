<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\TransactionItem;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        // Note: Postgres is case-sensitive with double quotes.
        // Table names: "TransactionItem", "Transaction"
        // Columns: "qty", "price", "cost", "discountPerUnit", "transactionId", "date"

        $query = TransactionItem::query()
            ->join('Transaction', 'TransactionItem.transactionId', '=', 'Transaction.id')
            ->where('TransactionItem.type', 'ITEM');

        // Apply date filter
        if ($startDate) {
            $query->whereDate('Transaction.date', '>=', $startDate);
        }
        if ($endDate) {
            $query->whereDate('Transaction.date', '<=', $endDate);
        }

        $stockReady = Product::sum('stock');

        $stats = $query->select(
            DB::raw('SUM("TransactionItem"."qty") as qty_sold'),
            DB::raw('SUM(("TransactionItem"."price" * "TransactionItem"."qty") - (COALESCE("TransactionItem"."discountPerUnit", 0) * "TransactionItem"."qty")) as revenue'),
            DB::raw('SUM((("TransactionItem"."price" - "TransactionItem"."cost" - COALESCE("TransactionItem"."discountPerUnit", 0)) * "TransactionItem"."qty")) as profit')
        )->first();

        // 5. Chart Data (Daily Revenue)
        $chartQuery = TransactionItem::query()
            ->join('Transaction', 'TransactionItem.transactionId', '=', 'Transaction.id');

        if ($startDate) {
            $chartQuery->whereDate('Transaction.date', '>=', $startDate);
        }
        if ($endDate) {
            $chartQuery->whereDate('Transaction.date', '<=', $endDate);
        }

        // Group by Date.
        $chartData = $chartQuery->select(
            DB::raw('DATE("Transaction"."date") as date'),
            DB::raw('SUM(("TransactionItem"."price" * "TransactionItem"."qty") - (COALESCE("TransactionItem"."discountPerUnit", 0) * "TransactionItem"."qty")) as revenue')
        )
            ->groupBy(DB::raw('DATE("Transaction"."date")'))
            ->orderBy('date', 'asc')
            ->get();

        return response()->json([
            'stock_ready' => (int) $stockReady,
            'qty_sold' => (int) $stats->qty_sold,
            'revenue' => (float) $stats->revenue,
            'profit' => (float) $stats->profit,
            'chart_data' => $chartData
        ]);
    }
}
