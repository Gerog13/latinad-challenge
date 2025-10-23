import { useState, useEffect, useCallback } from "react";
import { ScreenWithLocation, MapFilters } from "../types/map";
import { mapService } from "../services/map";
import { screenService } from "@services/screen";
import { useAuth } from "./useAuth";

export const useMap = () => {
  const [screens, setScreens] = useState<ScreenWithLocation[]>([]);
  const [filteredScreens, setFilteredScreens] = useState<ScreenWithLocation[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MapFilters>({});
  const { token } = useAuth();

  const loadScreens = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const screensData = await screenService.fetchScreens({
        params: { pageSize: 100, offset: 0 },
        token,
      });
      const screensWithLocation = mapService.addLocationToScreens(
        screensData.data
      );
      setScreens(screensWithLocation);
      setFilteredScreens(screensWithLocation);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const applyFilters = useCallback(
    (newFilters: MapFilters) => {
      setFilters(newFilters);

      let filtered = [...screens];

      // Filtrar por tipo
      if (newFilters.type) {
        filtered = filtered.filter((screen) => screen.type === newFilters.type);
      }

      // Filtrar por rango de precio
      if (newFilters.priceRange) {
        filtered = filtered.filter((screen) => {
          const price = Number(screen.price_per_day);
          return (
            price >= newFilters.priceRange!.min &&
            price <= newFilters.priceRange!.max
          );
        });
      }

      // Filtrar por estado activo (basado en horarios de funcionamiento)
      if (newFilters.isActive !== undefined) {
        filtered = filtered.filter((screen) => {
          if (!screen.rules) return !newFilters.isActive;

          try {
            const workingHours = JSON.parse(screen.rules);
            const now = new Date();
            const currentDay = now
              .toLocaleDateString("en-US", { weekday: "long" })
              .toLowerCase();
            const currentTime = now.toTimeString().slice(0, 5);

            const dayRanges = workingHours[currentDay] || [];
            const isActive = dayRanges.some(
              (range: any) =>
                currentTime >= range.start && currentTime <= range.end
            );

            return newFilters.isActive ? isActive : !isActive;
          } catch {
            return !newFilters.isActive;
          }
        });
      }

      setFilteredScreens(filtered);
    },
    [screens]
  );

  const resetFilters = useCallback(() => {
    setFilters({});
    setFilteredScreens(screens);
  }, [screens]);

  const getMapCenter = useCallback(() => {
    return mapService.getMapCenter(filteredScreens);
  }, [filteredScreens]);

  useEffect(() => {
    loadScreens();
  }, [loadScreens]);

  return {
    screens: filteredScreens,
    allScreens: screens,
    loading,
    error,
    filters,
    loadScreens,
    applyFilters,
    resetFilters,
    getMapCenter,
  };
};
