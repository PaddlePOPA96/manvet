import { useMemo, useState } from "react";

export function useStockFilters(inventoryData) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [conditionChartLimit, setConditionChartLimit] = useState(6);

  const filteredInventory = useMemo(() => {
    return (inventoryData || []).filter((item) => {
      const name = (item.name || "").toLowerCase();
      const matchesSearch = name.includes(searchTerm.toLowerCase());
      return showLowStockOnly ? matchesSearch && item.stock < 10 : matchesSearch;
    });
  }, [inventoryData, searchTerm, showLowStockOnly]);

  const conditionChartData = useMemo(() => {
    const base = (inventoryData || [])
      .filter(
        (item) =>
          (item.stock || 0) > 0 ||
          (item.waste || 0) > 0 ||
          (item.quarantine || 0) > 0
      )
      .sort((a, b) => {
        const totalA =
          (a.stock || 0) + (a.waste || 0) + (a.quarantine || 0);
        const totalB =
          (b.stock || 0) + (b.waste || 0) + (b.quarantine || 0);
        return totalB - totalA;
      });

    const limit =
      conditionChartLimit && conditionChartLimit > 0
        ? conditionChartLimit
        : base.length;

    return base.slice(0, limit);
  }, [inventoryData, conditionChartLimit]);

  return {
    searchTerm,
    setSearchTerm,
    showLowStockOnly,
    setShowLowStockOnly,
    conditionChartLimit,
    setConditionChartLimit,
    filteredInventory,
    conditionChartData
  };
}

