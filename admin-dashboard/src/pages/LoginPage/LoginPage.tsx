import React from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import useLoginPage, { keyframes, particles, inputSx } from './useLoginPage';

const LoginPage: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isSubmitting,
    handleSubmit,
  } = useLoginPage();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />

      {/* Deep dark background */}
      <Box sx={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: [
          'radial-gradient(ellipse at 15% 50%, rgba(0,60,100,0.35) 0%, transparent 55%)',
          'radial-gradient(ellipse at 85% 15%, rgba(0,90,70,0.25) 0%, transparent 55%)',
          'radial-gradient(ellipse at 50% 85%, rgba(25,0,55,0.35) 0%, transparent 55%)',
          'linear-gradient(145deg, #050c18 0%, #0a1628 50%, #080f1e 100%)',
        ].join(', '),
      }} />

      {/* Subtle grid */}
      <Box sx={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: [
          'linear-gradient(rgba(0,188,212,0.035) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(0,188,212,0.035) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '64px 64px',
      }} />

      {/* Floating particles */}
      {particles.map((p) => (
        <Box key={p.id} sx={{
          position: 'fixed',
          top: p.top, left: p.left,
          width: p.size, height: p.size,
          borderRadius: '50%',
          background: 'rgba(0,188,212,0.55)',
          boxShadow: '0 0 6px rgba(0,188,212,0.4)',
          pointerEvents: 'none',
          zIndex: 0,
          animation: `${p.alt ? 'floatB' : 'floatA'} ${p.dur} ease-in-out ${p.delay} infinite`,
        }} />
      ))}

      {/* Main centered layout */}
      <Box sx={{
        position: 'relative', zIndex: 1,
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Container component="main" maxWidth="xs">

          {/* Glassmorphism card */}
          <Box sx={{
            p: 5,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            borderRadius: '20px',
            background: 'rgba(10,20,40,0.55)',
            backdropFilter: 'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)',
            border: '1px solid rgba(0,188,212,0.14)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}>

            {/* Logo with pulsing glow */}
            <Box sx={{ animation: 'pulse 3s ease-in-out infinite', mb: 1 }}>
              <Box
                component="img"
                src="/images/logo-icon.png"
                alt="AI Client"
                sx={{ width: 64, height: 64 }}
              />
            </Box>

            {/* Title */}
            <Typography component="h1" variant="h4" sx={{
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textShadow: '0 0 18px rgba(0,188,212,0.4)',
              mb: 0.3,
            }}>
              AI Client
            </Typography>
            <Typography variant="body2" sx={{
              color: 'rgba(0,188,212,0.65)',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              fontSize: '0.72rem',
              mb: 2.5,
            }}>
              Prompt Tool
            </Typography>

            {/* Accent divider */}
            <Box sx={{
              width: 56, height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(0,188,212,0.6), transparent)',
              mb: 3,
            }} />

            {/* Error */}
            {error && (
              <Alert severity="error" sx={{
                width: '100%', mb: 2,
                backgroundColor: 'rgba(200,50,50,0.15)',
                border: '1px solid rgba(200,50,50,0.3)',
                color: '#ff7a7a',
                '& .MuiAlert-icon': { color: '#ff7a7a' },
              }}>
                {error}
              </Alert>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                variant="outlined"
                sx={inputSx}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                variant="outlined"
                sx={inputSx}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  mt: 3, mb: 1, py: 1.5,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #00bcd4, #0097a7)',
                  color: '#fff',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontSize: '0.82rem',
                  boxShadow: '0 4px 22px rgba(0,188,212,0.35)',
                  transition: 'box-shadow 0.3s, transform 0.2s',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00d4e8, #00bcd4)',
                    boxShadow: '0 4px 32px rgba(0,188,212,0.55)',
                    transform: 'translateY(-1px)',
                  },
                  '&:active': { transform: 'translateY(0)' },
                  '&.Mui-disabled': {
                    background: 'rgba(0,188,212,0.25)',
                    boxShadow: 'none',
                  },
                }}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </Box>

            {/* Default credentials hint */}
            <Box sx={{
              mt: 3, pt: 2, width: '100%', textAlign: 'center',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
              <Typography variant="caption" sx={{
                color: 'rgba(255,255,255,0.28)',
                fontSize: '0.68rem',
                letterSpacing: '0.06em',
              }}>
                Default: admin@techlifecorp.com / admin123
              </Typography>
            </Box>

          </Box>
        </Container>
      </Box>
    </>
  );
};

export default LoginPage;
