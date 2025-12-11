import { useMemo, useState } from "react";
import { SALE_CONDITIONS } from "../constants/inventory";

function getTxDateKey(tx) {
  if (tx.date) return tx.date.split("T")[0]; // Use YYYY-MM-DD only
  if (tx.timestamp) {
    try {
      return new Date(tx.timestamp).toISOString().split("T")[0];
    } catch {
      return null;
    }
  }
  return null;
}

export function usePeriodFilter(transactions, products) {
  const [periodPreset, setPeriodPreset] = useState("30d");
  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");

  const { effectiveFrom, effectiveTo } = useMemo(() => {
    if (periodPreset === "all") {
      return { effectiveFrom: null, effectiveTo: null };
    }

    if (periodPreset === "custom") {
      return {
        effectiveFrom: periodFrom || null,
        effectiveTo: periodTo || null
      };
    }

    const today = new Date();
    const end = today.toISOString().split("T")[0];
    const startDate = new Date(today);

    if (periodPreset === "7d") {
      startDate.setDate(startDate.getDate() - 6);
    } else if (periodPreset === "30d") {
      startDate.setDate(startDate.getDate() - 29);
    }

    const start = startDate.toISOString().split("T")[0];

    return { effectiveFrom: start, effectiveTo: end };
  }, [periodPreset, periodFrom, periodTo]);

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((tx) => {
        const dateKey = getTxDateKey(tx);
        if (!dateKey) return false;
        if (effectiveFrom && dateKey < effectiveFrom) return false;
        if (effectiveTo && dateKey > effectiveTo) return false;
        return true;
      }),
    [transactions, effectiveFrom, effectiveTo]
  );

  const periodSalesByDate = useMemo(() => {
    const map = {};

    filteredTransactions.forEach((tx) => {
      if (tx.type !== "OUT" || !SALE_CONDITIONS.includes(tx.condition)) {
        return;
      }
      const qty = parseInt(tx.quantity, 10) || 0;
      const productInfo = products.find((p) => p.name === tx.product);
      const price = tx.price || productInfo?.price || 0;
      const revenueValue = price * qty;
      const dateKey = getTxDateKey(tx);
      if (!dateKey) return;
      map[dateKey] = (map[dateKey] || 0) + revenueValue;
    });

    const dates = Object.keys(map).sort();
    const last7 = dates.slice(-7);
    return last7.map((d) => ({ date: d, revenue: map[d] }));
  }, [filteredTransactions, products]);

  const periodTotals = useMemo(() => {
    let revenueSum = 0;
    let profitSum = 0;
    let soldSum = 0;

    filteredTransactions.forEach((tx) => {
      if (tx.type !== "OUT" || !SALE_CONDITIONS.includes(tx.condition)) {
        return;
      }
      const qty = parseInt(tx.quantity, 10) || 0;
      const productInfo = products.find((p) => p.name === tx.product);
      const price = tx.price || productInfo?.price || 0;
      const cost = tx.cost || productInfo?.cost || 0;

      revenueSum += price * qty;
      profitSum += (price - cost) * qty;
      soldSum += qty;
    });

    return {
      revenue: revenueSum,
      profit: profitSum,
      sold: soldSum
    };
  }, [filteredTransactions, products]);

  return {
    periodPreset,
    periodFrom,
    periodTo,
    setPeriodPreset,
    setPeriodFrom,
    setPeriodTo,
    effectiveFrom,
    effectiveTo,
    filteredTransactions,
    periodSalesByDate,
    periodTotals
  };
}
