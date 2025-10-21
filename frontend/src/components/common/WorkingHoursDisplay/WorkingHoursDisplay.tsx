import React from "react";
import { Box, Typography, Chip, Divider } from "@mui/material";
import { AccessTime as TimeIcon } from "@mui/icons-material";
import styles from "./WorkingHoursDisplay.module.css";
import {
  formatWorkingHoursForDisplay,
  hasWorkingHours,
} from "@lib/utils.workingHours";
import { WorkingHours } from "types/screen";

interface WorkingHoursDisplayProps {
  workingHours: WorkingHours;
}

const WorkingHoursDisplay: React.FC<WorkingHoursDisplayProps> = ({
  workingHours,
}) => {
  if (!hasWorkingHours(workingHours)) {
    return (
      <Box className={styles.container}>
        <Box className={styles.header}>
          <TimeIcon className={styles.headerIcon} />
          <Typography variant="overline" className={styles.title}>
            Horarios de funcionamiento
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          className={styles.noHours}
        >
          No hay horarios configurados
        </Typography>
      </Box>
    );
  }

  const formattedHours = formatWorkingHoursForDisplay(workingHours);

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <TimeIcon className={styles.headerIcon} />
        <Typography variant="overline" className={styles.title}>
          Horarios de funcionamiento
        </Typography>
      </Box>

      <Divider className={styles.divider} />

      <Box className={styles.hoursList}>
        {formattedHours.map((hourText, index) => (
          <Chip
            key={index}
            label={hourText}
            color="primary"
            variant="outlined"
            className={styles.hourChip}
            size="small"
          />
        ))}
      </Box>
    </Box>
  );
};

export default WorkingHoursDisplay;
