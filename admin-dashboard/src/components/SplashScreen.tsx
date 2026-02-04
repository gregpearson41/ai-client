import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, duration = 10000 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let currentProgress = 0;

    const scheduleNext = () => {
      if (cancelled) return;

      let delay: number;
      let increment: number;

      if (currentProgress < 35) {
        // fast, chunky jumps
        delay = 40 + Math.random() * 180;       // 40–220 ms
        increment = 3 + Math.random() * 7;       // 3–10 %
      } else if (currentProgress < 65) {
        // settling into a mid-pace
        delay = 100 + Math.random() * 220;       // 100–320 ms
        increment = 1.5 + Math.random() * 4.5;   // 1.5–6 %
      } else if (currentProgress < 88) {
        // noticeably slowing
        delay = 180 + Math.random() * 280;       // 180–460 ms
        increment = 0.7 + Math.random() * 2.8;   // 0.7–3.5 %
      } else {
        // crawls toward the end
        delay = 250 + Math.random() * 450;       // 250–700 ms
        increment = 0.2 + Math.random() * 0.9;   // 0.2–1.1 %
      }

      setTimeout(() => {
        if (cancelled) return;
        currentProgress = Math.min(currentProgress + increment, 99.5);
        setProgress(currentProgress);
        if (currentProgress < 99.5) {
          scheduleNext();
        }
      }, delay);
    };

    scheduleNext();

    // snap to 100 and hand off to the app
    const completeTimer = setTimeout(() => {
      if (cancelled) return;
      setProgress(100);
      onComplete();
    }, duration);

    return () => {
      cancelled = true;
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
              backgroundColor: '#d40000',
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
          mt: 3,
          fontFamily: 'monospace',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          fontSize: '1.72rem',
        }}
      >
        Loading...
      </Typography>
    </Box>
  );
};

export default SplashScreen;
