import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { MapFilters } from "../../../types/map";
import styles from "./MapFilters.module.css";

interface MapFiltersProps {
  filters: MapFilters;
  onFiltersChange: (filters: MapFilters) => void;
  onResetFilters: () => void;
  screensCount: number;
  totalScreensCount: number;
}

const MapFiltersComponent: React.FC<MapFiltersProps> = ({
  filters,
  onFiltersChange,
  onResetFilters,
  screensCount,
  totalScreensCount,
}) => {
  const [localFilters, setLocalFilters] = useState<MapFilters>(filters);

  const handleTypeChange = (type: "outdoor" | "indoor" | null) => {
    const newFilters = { ...localFilters, type };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceRangeChange = (
    _event: Event,
    newValue: number | number[]
  ) => {
    const [min, max] = newValue as number[];
    const newFilters = { ...localFilters, priceRange: { min, max } };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleActiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isActive = event.target.checked;
    const newFilters = { ...localFilters, isActive };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    setLocalFilters({});
    onResetFilters();
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <Paper className={styles.filtersContainer}>
      <Box className={styles.filtersHeader}>
        <FilterIcon className={styles.filterIcon} />
        <Typography variant="h6" className={styles.filtersTitle}>
          Filtros
        </Typography>
        <Chip
          label={`${screensCount}/${totalScreensCount}`}
          color="primary"
          size="small"
          className={styles.countChip}
        />
      </Box>

      <Divider className={styles.divider} />

      <Box className={styles.filtersContent}>
        {/* Filtro por tipo */}
        <FormControl fullWidth className={styles.filterControl}>
          <InputLabel>Tipo de Pantalla</InputLabel>
          <Select
            value={localFilters.type || ""}
            label="Tipo de Pantalla"
            onChange={(e) =>
              handleTypeChange(e.target.value as "outdoor" | "indoor" | null)
            }
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="outdoor">Outdoor</MenuItem>
            <MenuItem value="indoor">Indoor</MenuItem>
          </Select>
        </FormControl>

        {/* Filtro por rango de precio */}
        <Box className={styles.filterControl}>
          <Typography variant="subtitle2" className={styles.sliderLabel}>
            Rango de Precio (ARS/día)
          </Typography>
          <Slider
            value={
              localFilters.priceRange
                ? [localFilters.priceRange.min, localFilters.priceRange.max]
                : [0, 5000]
            }
            onChange={handlePriceRangeChange}
            valueLabelDisplay="auto"
            min={0}
            max={5000}
            step={100}
            marks={[
              { value: 0, label: "$0" },
              { value: 2500, label: "$2,500" },
              { value: 5000, label: "$5,000" },
            ]}
            className={styles.priceSlider}
          />
        </Box>

        {/* Filtro por estado activo */}
        <FormControlLabel
          control={
            <Switch
              checked={localFilters.isActive || false}
              onChange={handleActiveChange}
              color="primary"
            />
          }
          label="Solo pantallas activas ahora"
          className={styles.switchControl}
        />

        {/* Botones de acción */}
        <Box className={styles.actionsContainer}>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleReset}
            disabled={!hasActiveFilters}
            className={styles.resetButton}
          >
            Limpiar Filtros
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default MapFiltersComponent;
