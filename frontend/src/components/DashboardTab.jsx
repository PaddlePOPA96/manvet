import React from "react";
import {
  Package,
  TrendingUp,
  DollarSign,
  CheckCircle
} from "lucide-react";
import SummaryCard from "./SummaryCard";
import SalesOverviewChart from "./SalesOverviewChart";
import { formatRupiah } from "../utils/format";

export default function DashboardTab({
  inventoryData,
  periodTotals,
  periodSalesByDate
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard
          title="Stok Ready (Unit)"
          value={inventoryData.reduce(
            (acc, curr) => acc + curr.stock,
            0
          )}
          color="bg-blue-50 text-blue-700 border-blue-200"
          icon={<Package size={20} />}
        />
        <SummaryCard
          title="Qty Terjual (Periode)"
          value={periodTotals.sold}
          color="bg-green-50 text-green-700 border-green-200"
          icon={<TrendingUp size={20} />}
        />
        <SummaryCard
          title="Omzet Periode"
          value={formatRupiah(periodTotals.revenue)}
          color="bg-teal-50 text-teal-700 border-teal-200"
          icon={<DollarSign size={20} />}
          isMoney
        />
        <SummaryCard
          title="Profit Bersih Periode"
          value={formatRupiah(periodTotals.profit)}
          color="bg-emerald-100 text-emerald-800 border-emerald-300"
          icon={<CheckCircle size={20} />}
          isMoney
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-gray-700">
            Grafik Penjualan 7 Hari Terakhir
          </h2>
          <span className="text-xs text-gray-600">
            Berdasarkan transaksi OUT (SALE/Reseller/Consignment)
          </span>
        </div>
        {periodSalesByDate.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            Belum ada data transaksi penjualan.
          </p>
        ) : (
          <SalesOverviewChart data={periodSalesByDate} />
        )}
      </div>
    </div>
  );
}
