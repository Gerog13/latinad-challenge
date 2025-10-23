export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface ScreenWithLocation {
  id: string;
  name: string;
  description: string;
  picture_url?: string;
  price_per_day: string;
  resolution_height: string;
  resolution_width: string;
  type: 'outdoor' | 'indoor';
  rules?: string;
  location: Location;
}

export interface MapFilters {
  type?: 'outdoor' | 'indoor' | null;
  priceRange?: {
    min: number;
    max: number;
  };
  isActive?: boolean;
}
