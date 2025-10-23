import React from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Map as MapIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import InteractiveMap from "./InteractiveMap";
import MapFiltersComponent from "./MapFilters";
import { useMap } from "../../../hooks/useMap";
import { ScreenWithLocation } from "../../../types/map";
import styles from "./InteractiveMapView.module.css";

const InteractiveMapView: React.FC = () => {
  const navigate = useNavigate();
  const {
    screens,
    allScreens,
    loading,
    error,
    filters,
    applyFilters,
    resetFilters,
  } = useMap();

  const handleScreenClick = (screen: ScreenWithLocation) => {
    // Navegar a la vista de detalle
    navigate(`/screen/${screen.id}`);
  };

  const handleFiltersChange = (newFilters: any) => {
    applyFilters(newFilters);
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando mapa de pantallas...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={styles.errorContainer}>
        <Alert severity="error" sx={{ fontSize: "1.1rem" }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      {/* Header */}
      <Box className={styles.header}>
        <Box className={styles.headerContent}>
          <Box>
            <Typography variant="h4" className={styles.title}>
              Explorador de Pantallas
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              className={styles.subtitle}
            >
              Visualiza y explora todas las pantallas disponibles en Buenos
              Aires
            </Typography>
          </Box>
        </Box>

        <Box className={styles.statsContainer}>
          <Box className={styles.statItem}>
            <LocationIcon className={styles.statIcon} />
            <Box>
              <Typography variant="h4" className={styles.statValue}>
                {allScreens.length}
              </Typography>
              <Typography variant="body2" className={styles.statLabel}>
                Pantallas Totales
              </Typography>
            </Box>
          </Box>

          <Box className={styles.statItem}>
            <MapIcon className={styles.statIcon} />
            <Box>
              <Typography variant="h4" className={styles.statValue}>
                {screens.length}
              </Typography>
              <Typography variant="body2" className={styles.statLabel}>
                Mostradas
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Contenido principal */}
      <Grid container spacing={3} className={styles.contentGrid}>
        {/* Mapa */}
        <Grid item xs={12} lg={8}>
          <InteractiveMap
            screens={screens}
            loading={loading}
            error={error}
            onScreenClick={handleScreenClick}
          />
        </Grid>

        {/* Filtros */}
        <Grid item xs={12} lg={4}>
          <MapFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onResetFilters={handleResetFilters}
            screensCount={screens.length}
            totalScreensCount={allScreens.length}
          />
        </Grid>
      </Grid>

      {/* Información adicional */}
      <Paper className={styles.infoContainer}>
        <Typography variant="h5" className={styles.infoTitle}>
          Guía de Uso
        </Typography>
        <Box className={styles.infoContent}>
          <Box className={styles.infoItem}>
            <Typography variant="body1" className={styles.infoText}>
              <strong>Navegación:</strong> Haz clic en cualquier marcador para ver detalles completos de la pantalla.
            </Typography>
          </Box>
          <Box className={styles.infoItem}>
            <Typography variant="body1" className={styles.infoText}>
              <strong>Filtros:</strong> Utiliza los filtros laterales para encontrar pantallas específicas por tipo, precio o estado.
            </Typography>
          </Box>
          <Box className={styles.infoItem}>
            <Typography variant="body1" className={styles.infoText}>
              <strong>Marcadores:</strong> Los azules son outdoor, los verdes son indoor. El punto central indica si está activa.
            </Typography>
          </Box>
          <Box className={styles.infoItem}>
            <Typography variant="body1" className={styles.infoText}>
              <strong>Preview:</strong> Pasa el cursor sobre cualquier marcador para ver información rápida.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default InteractiveMapView;
