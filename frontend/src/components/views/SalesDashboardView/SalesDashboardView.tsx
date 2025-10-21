import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
} from "@mui/icons-material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useSales } from "@hooks/useSales";
import { salesService } from "@services/sales";
import { DateRange } from "types/sales";
import styles from "./SalesDashboardView.module.css";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesDashboard: React.FC = () => {
  const { sales, stats, loading, error, filterByDateRange, resetFilter } =
    useSales();
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: "",
    endDate: "",
  });

  const handleDateRangeChange = (
    field: "startDate" | "endDate",
    value: string
  ) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilter = () => {
    if (dateRange.startDate && dateRange.endDate) {
      filterByDateRange(dateRange);
    }
  };

  const handleResetFilter = () => {
    setDateRange({ startDate: "", endDate: "" });
    resetFilter();
  };

  // Preparar datos para el gráfico
  const chartData = {
    labels: sales.map((sale) => salesService.formatDateForDisplay(sale.date)),
    datasets: [
      {
        label: "Venta total",
        data: sales.map((sale) => sale.value),
        backgroundColor: "rgba(0, 150, 136, 0.8)",
        borderColor: "rgba(0, 150, 136, 1)",
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: true,
        text: "Ventas Diarias",
        font: {
          size: 16,
          weight: "bold" as const,
        },
        color: "#424242",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#666",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#666",
          callback: function (value: any) {
            return salesService.formatCurrency(value);
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando datos de ventas...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={styles.errorContainer}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box className={styles.dashboardContainer}>
      <Typography variant="h4" className={styles.title}>
        Dashboard de Ventas
      </Typography>

      {/* Filtros */}
      <Paper className={styles.filtersContainer}>
        <Typography variant="h6" className={styles.filtersTitle}>
          Filtros de Fecha
        </Typography>
        <Box className={styles.filtersContent}>
          <TextField
            label="Fecha Inicio"
            type="date"
            value={dateRange.startDate}
            onChange={(e) => handleDateRangeChange("startDate", e.target.value)}
            InputLabelProps={{ shrink: true }}
            className={styles.dateInput}
          />
          <TextField
            label="Fecha Fin"
            type="date"
            value={dateRange.endDate}
            onChange={(e) => handleDateRangeChange("endDate", e.target.value)}
            InputLabelProps={{ shrink: true }}
            className={styles.dateInput}
          />
          <Button
            variant="contained"
            onClick={handleApplyFilter}
            disabled={!dateRange.startDate || !dateRange.endDate}
          >
            Aplicar Filtro
          </Button>
          <Button variant="outlined" onClick={handleResetFilter}>
            Limpiar Filtros
          </Button>
        </Box>
      </Paper>

      {/* Métricas */}
      {stats && (
        <Grid container spacing={3} className={styles.metricsContainer}>
          <Grid item xs={12} sm={6} md={3}>
            <Card className={styles.metricCard}>
              <CardContent>
                <Box className={styles.metricContent}>
                  <MoneyIcon className={styles.metricIcon} />
                  <Box>
                    <Typography variant="h6" className={styles.metricValue}>
                      {salesService.formatCurrency(stats.totalSales)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total de Ventas
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className={styles.metricCard}>
              <CardContent>
                <Box className={styles.metricContent}>
                  <TrendingUpIcon className={styles.metricIcon} />
                  <Box>
                    <Typography variant="h6" className={styles.metricValue}>
                      {salesService.formatCurrency(stats.averageSales)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Promedio Diario
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className={styles.metricCard}>
              <CardContent>
                <Box className={styles.metricContent}>
                  <TrendingUpIcon
                    className={styles.metricIcon}
                    color="success"
                  />
                  <Box>
                    <Typography variant="h6" className={styles.metricValue}>
                      {salesService.formatCurrency(stats.maxSales.value)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mayor Venta (
                      {salesService.formatDateForMetrics(stats.maxSales.date)})
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className={styles.metricCard}>
              <CardContent>
                <Box className={styles.metricContent}>
                  <TrendingDownIcon
                    className={styles.metricIcon}
                    color="error"
                  />
                  <Box>
                    <Typography variant="h6" className={styles.metricValue}>
                      {salesService.formatCurrency(stats.minSales.value)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Menor Venta (
                      {salesService.formatDateForMetrics(stats.minSales.date)})
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Gráfico */}
      <Paper className={styles.chartContainer}>
        <Typography variant="h6" className={styles.chartTitle}>
          Evolución de Ventas
        </Typography>
        <Box className={styles.chartContent}>
          <Bar data={chartData} options={chartOptions} />
        </Box>
      </Paper>
    </Box>
  );
};

export default SalesDashboard;
