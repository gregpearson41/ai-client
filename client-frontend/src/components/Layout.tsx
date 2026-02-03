import React from 'react';
import { Box } from '@mui/material';
import TopBar from './TopBar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <TopBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          maxWidth: 1200,
          width: '100%',
          mx: 'auto',
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
