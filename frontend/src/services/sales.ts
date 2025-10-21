import { Sale, SalesStats, DateRange } from "../types/sales";
import { uri } from "@lib/config";

/**
 * Obtiene todas las ventas desde la API
 */
export const fetchSales = async (): Promise<Sale[]> => {
  const res = await fetch(`${uri}/sales`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("No se encontraron datos de ventas");
    } else if (res.status === 500) {
      throw new Error("Error de servidor. Inténtalo de nuevo más tarde.");
    } else {
      throw new Error("Hubo un error. Inténtalo de nuevo más tarde.");
    }
  }

  const data: Sale[] = await res.json();
  return data;
};

/**
 * Calcula estadísticas de ventas
 */
export const calculateSalesStats = (sales: Sale[]): SalesStats => {
  if (sales.length === 0) {
    return {
      totalSales: 0,
      averageSales: 0,
      minSales: { id: 0, date: "", value: 0 },
      maxSales: { id: 0, date: "", value: 0 },
      totalDays: 0,
    };
  }

  const totalSales = sales.reduce((sum, sale) => sum + sale.value, 0);
  const averageSales = totalSales / sales.length;

  const minSales = sales.reduce((min, sale) =>
    sale.value < min.value ? sale : min
  );

  const maxSales = sales.reduce((max, sale) =>
    sale.value > max.value ? sale : max
  );

  return {
    totalSales,
    averageSales: Math.round(averageSales * 100) / 100, // Redondear a 2 decimales
    minSales,
    maxSales,
    totalDays: sales.length,
  };
};

/**
 * Filtra ventas por rango de fechas
 */
export const filterSalesByDateRange = (
  sales: Sale[],
  dateRange: DateRange
): Sale[] => {
  const { startDate, endDate } = dateRange;

  return sales.filter((sale) => {
    const saleDate = new Date(sale.date);

    // Normalizar fechas al inicio del día (00:00:00)
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    // Normalizar fecha fin al final del día (23:59:59.999)
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return saleDate >= start && saleDate <= end;
  });
};

/**
 * Formatea fecha para mostrar en la UI (formato compacto para gráficos)
 */
export const formatDateForDisplay = (dateString: string): string => {
  // Crear fecha local directamente sin conversión UTC
  const date = new Date(dateString + "T00:00:00");

  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
  });
};

/**
 * Formatea fecha completa para mostrar en métricas
 */
export const formatDateForMetrics = (dateString: string): string => {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Formatea valor monetario para mostrar en la UI
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const salesService = {
  fetchSales,
  calculateSalesStats,
  filterSalesByDateRange,
  formatDateForDisplay,
  formatDateForMetrics,
  formatCurrency,
};
