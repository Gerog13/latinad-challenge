export interface Sale {
  id: number;
  date: string; // YYYY-MM-DD
  value: number;
}

export interface SalesStats {
  totalSales: number;
  averageSales: number;
  minSales: Sale;
  maxSales: Sale;
  totalDays: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface SalesChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
}
