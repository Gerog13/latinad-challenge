import { WorkingHours, TimeRange } from '../types/screen';

/**
 * Días de la semana en español
 */
export const WEEK_DAYS = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
] as const;

/**
 * Valida que una hora esté en formato HH:MM
 */
export const isValidTimeFormat = (time: string): boolean => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
};

/**
 * Valida que el rango de tiempo sea válido (hora inicio < hora fin)
 */
export const isValidTimeRange = (start: string, end: string): boolean => {
    if (!isValidTimeFormat(start) || !isValidTimeFormat(end)) {
        return false;
    }
    
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    return startMinutes < endMinutes;
};

/**
 * Convierte WorkingHours a string JSON para enviar a la API
 */
export const workingHoursToJsonString = (workingHours: WorkingHours): string => {
    return JSON.stringify(workingHours);
};

/**
 * Convierte string JSON de la API a WorkingHours
 */
export const jsonStringToWorkingHours = (jsonString: string | undefined): WorkingHours => {
    if (!jsonString) return {};
    
    try {
        const parsed = JSON.parse(jsonString);
        return typeof parsed === 'object' && parsed !== null ? parsed : {};
    } catch {
        return {};
    }
};

/**
 * Crea un WorkingHours vacío con arrays vacíos para cada día
 */
export const createEmptyWorkingHours = (): WorkingHours => {
    const emptyHours: WorkingHours = {};
    WEEK_DAYS.forEach(day => {
        emptyHours[day.key] = [];
    });
    return emptyHours;
};

/**
 * Agrega un nuevo rango de tiempo a un día específico
 */
export const addTimeRangeToDay = (
    workingHours: WorkingHours, 
    day: string, 
    timeRange: TimeRange
): WorkingHours => {
    return {
        ...workingHours,
        [day]: [...(workingHours[day] || []), timeRange]
    };
};

/**
 * Elimina un rango de tiempo específico de un día
 */
export const removeTimeRangeFromDay = (
    workingHours: WorkingHours, 
    day: string, 
    rangeIndex: number
): WorkingHours => {
    const dayRanges = workingHours[day] || [];
    const updatedRanges = dayRanges.filter((_: TimeRange, index: number) => index !== rangeIndex);
    
    return {
        ...workingHours,
        [day]: updatedRanges
    };
};

/**
 * Formatea los horarios para mostrar en la vista de detalle
 */
export const formatWorkingHoursForDisplay = (workingHours: WorkingHours): string[] => {
    const formattedHours: string[] = [];
    
    WEEK_DAYS.forEach(day => {
        const ranges = workingHours[day.key];
        if (ranges && ranges.length > 0) {
            const rangesText = ranges.map((range: TimeRange) => `${range.start} - ${range.end}`).join(', ');
            formattedHours.push(`${day.label}: ${rangesText}`);
        }
    });
    
    return formattedHours;
};

/**
 * Verifica si hay al menos un horario configurado
 */
export const hasWorkingHours = (workingHours: WorkingHours): boolean => {
    return WEEK_DAYS.some(day => {
        const ranges = workingHours[day.key];
        return ranges && ranges.length > 0;
    });
};
