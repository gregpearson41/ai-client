import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, duration = 10000 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = 100;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return newProgress;
      });
    }, interval);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(145deg, #050c18 0%, #0a1628 50%, #080f1e 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      {/* Grid overlay */}
      <Box sx={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        backgroundImage: [
          'linear-gradient(rgba(0,188,212,0.04) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(0,188,212,0.04) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '64px 64px',
      }} />

      {/* Logo */}
      <Box
        component="img"
        src="/images/logo-full.png"
        alt="AI Client"
        sx={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '400px',
          width: '80%',
          height: 'auto',
          mb: 4,
          filter: 'drop-shadow(0 0 24px rgba(0,188,212,0.3))',
        }}
      />

      {/* Progress bar */}
      <Box sx={{ width: '300px', maxWidth: '80%', position: 'relative', zIndex: 1 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 3,
            borderRadius: 2,
            backgroundColor: 'rgba(0,188,212,0.15)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#00bcd4',
              borderRadius: 2,
              boxShadow: '0 0 10px rgba(0,188,212,0.5)',
            },
          }}
        />
      </Box>

      {/* Loading text */}
      <Typography
        variant="body2"
        sx={{
          position: 'relative',
          zIndex: 1,
          color: 'rgba(0,188,212,0.6)',
          mt: 2,
          fontFamily: 'monospace',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          fontSize: '0.72rem',
        }}
      >
        Loading...
      </Typography>
    </Box>
  );
};

export default SplashScreen;
