import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 1.5,
        px: 3,
        mt: 'auto',
        backgroundColor: 'rgba(8,15,30,0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(0,188,212,0.12)',
      }}
    >
      <Typography variant="body2" align="center" sx={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.72rem' }}>
        {'© '}
        {new Date().getFullYear()}{' '}
        <Link href="#" sx={{ color: 'rgba(0,188,212,0.6)', textDecoration: 'none', '&:hover': { color: '#00bcd4' } }}>
          AI Client Dashboard
        </Link>
        {' | All rights reserved.'}
      </Typography>
    </Box>
  );
};

export default Footer;
