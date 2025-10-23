import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Tooltip,
} from "react-leaflet";
import { Icon, LatLngTuple } from "leaflet";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  Tv as TvIcon,
  AttachMoney as MoneyIcon,
} from "@mui/icons-material";
import {
  jsonStringToWorkingHours,
  formatWorkingHoursForDisplay,
} from "@lib/utils.workingHours";
import styles from "./InteractiveMap.module.css";
import "leaflet/dist/leaflet.css";
import { formatScreenType } from "@lib/utils.string";
import { formatARS } from "@lib/utils.number";
import { ScreenWithLocation } from "types/map";

// Fix para iconos de Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface InteractiveMapProps {
  screens: ScreenWithLocation[];
  loading: boolean;
  error: string | null;
  onScreenClick?: (screen: ScreenWithLocation) => void;
}

interface MapCenterProps {
  center: LatLngTuple;
}

const MapCenter: React.FC<MapCenterProps> = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 13);
  }, [map, center]);

  return null;
};

const ScreenMarker: React.FC<{
  screen: ScreenWithLocation;
  onClick?: (screen: ScreenWithLocation) => void;
}> = ({ screen, onClick }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!screen.rules) return;

    try {
      const workingHours = jsonStringToWorkingHours(screen.rules);
      const now = new Date();
      const currentDay = now
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();
      const currentTime = now.toTimeString().slice(0, 5);

      const dayRanges = workingHours[currentDay] || [];
      const active = dayRanges.some(
        (range: any) => currentTime >= range.start && currentTime <= range.end
      );

      setIsActive(active);
    } catch {
      setIsActive(false);
    }
  }, [screen.rules]);

  const getMarkerColor = () => {
    if (screen.type === "outdoor") return "#1976d2"; // Azul para outdoor
    return "#4caf50"; // Verde para indoor
  };

  const getMarkerIcon = () => {
    const color = getMarkerColor();
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path fill="${color}" stroke="#fff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z"/>
          <circle fill="#fff" cx="12.5" cy="12.5" r="6"/>
          ${
            isActive
              ? '<circle fill="' + color + '" cx="12.5" cy="12.5" r="3"/>'
              : ""
          }
        </svg>
      `)}`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41],
    });
  };

  const workingHours = screen.rules
    ? jsonStringToWorkingHours(screen.rules)
    : null;
  const formattedHours = workingHours
    ? formatWorkingHoursForDisplay(workingHours)
    : [];

  return (
    <Marker
      position={[screen.location.lat, screen.location.lng]}
      icon={getMarkerIcon()}
      eventHandlers={{
        click: () => onClick?.(screen),
      }}
    >
      <Tooltip
        direction="top"
        offset={[0, -10]}
        opacity={0.95}
        className={styles.tooltip}
      >
        <Box className={styles.tooltipContent}>
          <Box className={styles.tooltipHeader}>
            <TvIcon className={styles.tooltipIcon} />
            <Typography variant="subtitle2" className={styles.tooltipTitle}>
              {screen.name}
            </Typography>
          </Box>

          <Box className={styles.tooltipDetails}>
            <Chip
              label={formatScreenType(screen.type)}
              color={screen.type === "outdoor" ? "primary" : "success"}
              size="small"
              className={styles.tooltipChip}
            />

            <Box className={styles.tooltipPrice}>
              <MoneyIcon className={styles.tooltipPriceIcon} />
              <Typography variant="caption" className={styles.tooltipPriceText}>
                {formatARS(Number(screen.price_per_day))}/día
              </Typography>
            </Box>
          </Box>

          <Typography variant="caption" className={styles.tooltipStatus}>
            {isActive ? "🟢 Activa ahora" : "⚪ Inactiva"}
          </Typography>
        </Box>
      </Tooltip>

      <Popup className={styles.popup}>
        <Box className={styles.popupContent}>
          <Box className={styles.popupHeader}>
            <TvIcon className={styles.screenIcon} />
            <Typography variant="h6" className={styles.screenName}>
              {screen.name}
            </Typography>
          </Box>

          <Typography variant="body2" className={styles.description}>
            {screen.description}
          </Typography>

          <Box className={styles.popupDetails}>
            <Chip
              label={formatScreenType(screen.type)}
              color={screen.type === "outdoor" ? "primary" : "success"}
              size="small"
              className={styles.typeChip}
            />

            <Box className={styles.priceContainer}>
              <MoneyIcon className={styles.priceIcon} />
              <Typography variant="body2" className={styles.price}>
                {formatARS(Number(screen.price_per_day))}/día
              </Typography>
            </Box>

            <Box className={styles.resolutionContainer}>
              <Typography variant="body2" className={styles.resolution}>
                {screen.resolution_width} x {screen.resolution_height}
              </Typography>
            </Box>
          </Box>

          {formattedHours.length > 0 && (
            <Box className={styles.workingHoursContainer}>
              <Typography
                variant="subtitle2"
                className={styles.workingHoursTitle}
              >
                Horarios de Funcionamiento:
              </Typography>
              {formattedHours.slice(0, 2).map((hour: string, index: number) => (
                <Typography
                  key={index}
                  variant="caption"
                  className={styles.workingHour}
                >
                  {hour}
                </Typography>
              ))}
              {formattedHours.length > 2 && (
                <Typography variant="caption" className={styles.moreHours}>
                  +{formattedHours.length - 2} más...
                </Typography>
              )}
            </Box>
          )}

          <Box className={styles.locationContainer}>
            <LocationIcon className={styles.locationIcon} />
            <Typography variant="caption" className={styles.address}>
              {screen.location.address}
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="small"
            className={styles.viewDetailsButton}
            onClick={() => onClick?.(screen)}
          >
            Ver Detalles
          </Button>
        </Box>
      </Popup>
    </Marker>
  );
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  screens,
  loading,
  error,
  onScreenClick,
}) => {
  const [mapCenter, setMapCenter] = useState<LatLngTuple>([-34.6037, -58.3816]);

  useEffect(() => {
    if (screens.length > 0) {
      const center = screens.reduce(
        (acc, screen) => ({
          lat: acc.lat + screen.location.lat,
          lng: acc.lng + screen.location.lng,
        }),
        { lat: 0, lng: 0 }
      );

      const avgCenter: LatLngTuple = [
        center.lat / screens.length,
        center.lng / screens.length,
      ];

      setMapCenter(avgCenter);
    }
  }, [screens]);

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando mapa de pantallas...
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
    <Paper className={styles.mapContainer}>
      <Box className={styles.mapHeader}>
        <Typography variant="h5" className={styles.mapTitle}>
          Mapa Interactivo de Pantallas
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          className={styles.mapTitle}
        >
          {screens.length} pantalla{screens.length !== 1 ? "s" : ""} encontrada
          {screens.length !== 1 ? "s" : ""}
        </Typography>
      </Box>

      <Box className={styles.mapWrapper}>
        <MapContainer
          center={mapCenter}
          zoom={13}
          className={styles.map}
          scrollWheelZoom={true}
        >
          <MapCenter center={mapCenter} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {screens.map((screen) => (
            <ScreenMarker
              key={screen.id}
              screen={screen}
              onClick={onScreenClick}
            />
          ))}
        </MapContainer>
      </Box>
    </Paper>
  );
};

export default InteractiveMap;
