import { Location, ScreenWithLocation } from "../types/map";
import { Screen } from "../types/screen";

// Mock de ubicaciones reales de Buenos Aires
const MOCK_LOCATIONS: Record<string, Location> = {
  "1": { lat: -34.6037, lng: -58.3816, address: "Av. Corrientes 1234, CABA" },
  "2": { lat: -34.6118, lng: -58.396, address: "Av. Santa Fe 5678, CABA" },
  "3": { lat: -34.6097, lng: -58.3732, address: "Av. 9 de Julio 1000, CABA" },
  "4": { lat: -34.6158, lng: -58.4333, address: "Av. Rivadavia 2000, CABA" },
  "5": { lat: -34.6205, lng: -58.3732, address: "Av. Callao 1500, CABA" },
  "6": { lat: -34.6037, lng: -58.3816, address: "Av. Corrientes 2000, CABA" },
  "7": { lat: -34.6118, lng: -58.396, address: "Av. Santa Fe 3000, CABA" },
  "8": { lat: -34.6097, lng: -58.3732, address: "Av. 9 de Julio 2000, CABA" },
  "9": { lat: -34.6158, lng: -58.4333, address: "Av. Rivadavia 3000, CABA" },
  "10": { lat: -34.6205, lng: -58.3732, address: "Av. Callao 2500, CABA" },
};

// Función para obtener una ubicación aleatoria si no existe
const getRandomLocation = (): Location => {
  const locations = Object.values(MOCK_LOCATIONS);
  return locations[Math.floor(Math.random() * locations.length)];
};

// Función para agregar ubicaciones a las pantallas
export const addLocationToScreens = (
  screens: Screen[]
): ScreenWithLocation[] => {
  return screens.map((screen) => ({
    ...screen,
    id: screen.id || Math.random().toString(),
    location: MOCK_LOCATIONS[screen.id || ""] || getRandomLocation(),
  }));
};

// Función para obtener el centro del mapa basado en las pantallas
export const getMapCenter = (screens: ScreenWithLocation[]): Location => {
  if (screens.length === 0) {
    return { lat: -34.6037, lng: -58.3816, address: "Centro de Buenos Aires" }; // Centro de Buenos Aires por defecto
  }

  const avgLat =
    screens.reduce((sum, screen) => sum + screen.location.lat, 0) /
    screens.length;
  const avgLng =
    screens.reduce((sum, screen) => sum + screen.location.lng, 0) /
    screens.length;

  return { lat: avgLat, lng: avgLng, address: "Centro calculado" };
};

// Función para filtrar pantallas por ubicación (radio)
export const filterScreensByRadius = (
  screens: ScreenWithLocation[],
  center: Location,
  radiusKm: number
): ScreenWithLocation[] => {
  return screens.filter((screen) => {
    const distance = calculateDistance(center, screen.location);
    return distance <= radiusKm;
  });
};

// Función para calcular distancia entre dos puntos (Haversine)
const calculateDistance = (point1: Location, point2: Location): number => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
  const dLng = ((point2.lng - point1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((point1.lat * Math.PI) / 180) *
      Math.cos((point2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const mapService = {
  addLocationToScreens,
  getMapCenter,
  filterScreensByRadius,
  MOCK_LOCATIONS,
};
