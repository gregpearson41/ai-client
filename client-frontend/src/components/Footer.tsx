import React, { useState, useEffect } from 'react';
import { Box, Typography, Link } from '@mui/material';
import { api } from '../services/api';

const Footer: React.FC = () => {
  const [buildNumber, setBuildNumber] = useState<string | null>(null);
  const [companyOwner, setCompanyOwner] = useState<string | null>(null);

  useEffect(() => {
    api.systemInfo()
      .then((res) => {
        setBuildNumber(res.data.buildNumber);
        setCompanyOwner(res.data.companyOwner);
      })
      .catch(() => {});
  }, []);

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 3,
        mt: 'auto',
        backgroundColor: 'rgba(255, 255, 255, 0.72)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        textAlign: 'center',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5 }}>
        <Box
          component="img"
          src="/images/logo-icon.png"
          alt="AI Client"
          sx={{ width: 18, height: 18, opacity: 0.5 }}
        />
        <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.4)', fontSize: '0.75rem' }}>
          {'© '}
          {new Date().getFullYear()}{' '}
          <Link href="#" underline="none" sx={{ color: '#00bcd4', '&:hover': { color: '#0097a7' } }}>
            AI Client
          </Link>
          {' — All rights reserved.'}
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.28)', fontSize: '0.68rem' }}>
        {companyOwner || 'TechLifeCorp'}{buildNumber ? ` · Build ${buildNumber}` : ''}
      </Typography>
    </Box>
  );
};

export default Footer;
