import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface TimeClockProps {
  showDate?: boolean;
  showSeconds?: boolean;
  use24Hour?: boolean;
  variant?: 'default' | 'compact';
}

const TimeClock: React.FC<TimeClockProps> = ({
  showDate = true,
  showSeconds = true,
  use24Hour = false,
  variant = 'default'
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      ...(showSeconds && { second: '2-digit' }),
      hour12: !use24Hour
    };
    return date.toLocaleTimeString(undefined, options);
  };

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString(undefined, options);
  };

  if (variant === 'compact') {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'inherit'
        }}
      >
        <AccessTimeIcon sx={{ fontSize: 20 }} />
        <Typography
          variant="body2"
          component="div"
          sx={{ fontFamily: 'monospace', fontWeight: 'medium' }}
        >
          {formatTime(currentTime)}
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        bgcolor: 'background.paper'
      }}
    >
      <AccessTimeIcon color="primary" sx={{ fontSize: 40 }} />
      <Box>
        <Typography variant="h4" component="div" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
          {formatTime(currentTime)}
        </Typography>
        {showDate && (
          <Typography variant="body2" color="text.secondary">
            {formatDate(currentTime)}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default TimeClock;
