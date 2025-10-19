export type ScreenType = 'outdoor' | 'indoor'

export interface QueryParams {
    pageSize: number,
    offset: number,
    name?: string,
    type?: ScreenType | null
}

export interface TimeRange {
    start: string; // formato "HH:MM"
    end: string;   // formato "HH:MM"
}

export interface WorkingHours {
    [day: string]: TimeRange[]; // ej: "monday": [{start: "08:00", end: "13:00"}, {start: "16:30", end: "23:00"}]
}

export interface Screen {
    id?: string,
    name: string,
    description: string,
    picture_url?: string,
    user_id?: number,
    price_per_day: string,
    resolution_height: string,
    resolution_width: string,
    type: ScreenType,
    rules?: string; // JSON string con WorkingHours
}

export interface ScreenListResponse {
    totalCount: number,
    data:Screen[]
}
