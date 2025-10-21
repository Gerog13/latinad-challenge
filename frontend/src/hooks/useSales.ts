import { useState, useEffect, useCallback } from "react";
import { Sale, SalesStats, DateRange } from "../types/sales";
import { salesService } from "../services/sales";

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga todas las ventas desde la API
   */
  const loadSales = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const salesData = await salesService.fetchSales();
      setSales(salesData);
      setFilteredSales(salesData);

      // Calcular estadísticas iniciales
      const initialStats = salesService.calculateSalesStats(salesData);
      setStats(initialStats);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Filtra ventas por rango de fechas
   */
  const filterByDateRange = useCallback(
    (dateRange: DateRange) => {
      const filtered = salesService.filterSalesByDateRange(sales, dateRange);
      setFilteredSales(filtered);
      // Recalcular estadísticas con datos filtrados
      const filteredStats = salesService.calculateSalesStats(filtered);
      setStats(filteredStats);
    },
    [sales]
  );

  /**
   * Resetea el filtro y muestra todas las ventas
   */
  const resetFilter = useCallback(() => {
    setFilteredSales(sales);
    const allStats = salesService.calculateSalesStats(sales);
    setStats(allStats);
  }, [sales]);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadSales();
  }, [loadSales]);

  return {
    sales: filteredSales,
    allSales: sales,
    stats,
    loading,
    error,
    loadSales,
    filterByDateRange,
    resetFilter,
  };
};
