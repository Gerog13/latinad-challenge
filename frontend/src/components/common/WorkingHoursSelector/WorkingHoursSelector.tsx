import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormHelperText,
  Chip,
  Collapse,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";

import styles from "./WorkingHoursSelector.module.css";
import { TimeRange, WorkingHours } from "types/screen";
import {
  addTimeRangeToDay,
  createEmptyWorkingHours,
  isValidTimeFormat,
  isValidTimeRange,
  removeTimeRangeFromDay,
  WEEK_DAYS,
} from "@lib/utils.workingHours";

interface WorkingHoursSelectorProps {
  value: WorkingHours;
  onChange: (workingHours: WorkingHours) => void;
  error?: string;
}

interface DayTimeRangesProps {
  dayKey: string;
  dayLabel: string;
  ranges: TimeRange[];
  onAddRange: (dayKey: string, timeRange: TimeRange) => void;
  onRemoveRange: (dayKey: string, rangeIndex: number) => void;
}

const DayTimeRanges: React.FC<DayTimeRangesProps> = ({
  dayKey,
  dayLabel,
  ranges,
  onAddRange,
  onRemoveRange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newStartTime, setNewStartTime] = useState("08:00");
  const [newEndTime, setNewEndTime] = useState("20:00");
  const [timeError, setTimeError] = useState<string>("");

  const handleAddRange = () => {
    // Validar formato de horas
    if (!isValidTimeFormat(newStartTime) || !isValidTimeFormat(newEndTime)) {
      setTimeError("Formato de hora inválido. Use HH:MM");
      return;
    }

    // Validar que hora inicio < hora fin
    if (!isValidTimeRange(newStartTime, newEndTime)) {
      setTimeError("La hora de inicio debe ser menor que la hora de fin");
      return;
    }

    // Validar que no se solape con rangos existentes
    const hasOverlap = ranges.some((range) => {
      const newStart = newStartTime.split(":").map(Number);
      const newEnd = newEndTime.split(":").map(Number);
      const existingStart = range.start.split(":").map(Number);
      const existingEnd = range.end.split(":").map(Number);

      const newStartMinutes = newStart[0] * 60 + newStart[1];
      const newEndMinutes = newEnd[0] * 60 + newEnd[1];
      const existingStartMinutes = existingStart[0] * 60 + existingStart[1];
      const existingEndMinutes = existingEnd[0] * 60 + existingEnd[1];

      return (
        (newStartMinutes >= existingStartMinutes &&
          newStartMinutes < existingEndMinutes) ||
        (newEndMinutes > existingStartMinutes &&
          newEndMinutes <= existingEndMinutes) ||
        (newStartMinutes <= existingStartMinutes &&
          newEndMinutes >= existingEndMinutes)
      );
    });

    if (hasOverlap) {
      setTimeError("Este horario se solapa con uno existente");
      return;
    }

    onAddRange(dayKey, { start: newStartTime, end: newEndTime });
    setTimeError("");
    setNewStartTime("08:00");
    setNewEndTime("20:00");
  };

  const handleRemoveRange = (index: number) => {
    onRemoveRange(dayKey, index);
  };

  return (
    <Card variant="outlined" className={styles.dayCard}>
      <CardContent className={styles.dayCardContent}>
        <Box className={styles.dayHeader}>
          <Typography variant="subtitle2" className={styles.dayLabel}>
            {dayLabel}
          </Typography>
          <IconButton
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.expandButton}
          >
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        {ranges.length > 0 && (
          <Box className={styles.rangesContainer}>
            {ranges.map((range, index) => (
              <Chip
                key={index}
                label={`${range.start} - ${range.end}`}
                onDelete={() => handleRemoveRange(index)}
                deleteIcon={<DeleteIcon />}
                color="primary"
                variant="outlined"
                className={styles.timeChip}
              />
            ))}
          </Box>
        )}

        <Collapse in={isExpanded}>
          <Box className={styles.addRangeContainer}>
            <Box className={styles.timeInputsContainer}>
              <TextField
                size="small"
                label="Inicio"
                type="time"
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                className={styles.timeInput}
              />
              <Typography variant="body2" className={styles.timeSeparator}>
                hasta
              </Typography>
              <TextField
                size="small"
                label="Fin"
                type="time"
                value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                className={styles.timeInput}
              />
            </Box>

            {timeError && (
              <FormHelperText error className={styles.timeError}>
                {timeError}
              </FormHelperText>
            )}

            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddRange}
              variant="outlined"
              className={styles.addButton}
            >
              Agregar horario
            </Button>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

const WorkingHoursSelector: React.FC<WorkingHoursSelectorProps> = ({
  value,
  onChange,
  error,
}) => {
  const [workingHours, setWorkingHours] = useState<WorkingHours>(
    value || createEmptyWorkingHours()
  );

  useEffect(() => {
    setWorkingHours(value || createEmptyWorkingHours());
  }, [value]);

  const handleAddRange = (dayKey: string, timeRange: TimeRange) => {
    const updatedHours = addTimeRangeToDay(workingHours, dayKey, timeRange);
    setWorkingHours(updatedHours);
    onChange(updatedHours);
  };

  const handleRemoveRange = (dayKey: string, rangeIndex: number) => {
    const updatedHours = removeTimeRangeFromDay(
      workingHours,
      dayKey,
      rangeIndex
    );
    setWorkingHours(updatedHours);
    onChange(updatedHours);
  };

  return (
    <FormControl fullWidth error={Boolean(error)}>
      <Box className={styles.container}>
        <Box className={styles.header}>
          <TimeIcon className={styles.headerIcon} />
          <Typography variant="h6" className={styles.title}>
            Horarios de funcionamiento
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          className={styles.subtitle}
        >
          Configure los horarios en los que la pantalla estará disponible
        </Typography>

        <Divider className={styles.divider} />

        <Box className={styles.daysContainer}>
          {WEEK_DAYS.map((day) => (
            <DayTimeRanges
              key={day.key}
              dayKey={day.key}
              dayLabel={day.label}
              ranges={workingHours[day.key] || []}
              onAddRange={handleAddRange}
              onRemoveRange={handleRemoveRange}
            />
          ))}
        </Box>

        {error && (
          <FormHelperText error className={styles.errorText}>
            {error}
          </FormHelperText>
        )}
      </Box>
    </FormControl>
  );
};

export default WorkingHoursSelector;
