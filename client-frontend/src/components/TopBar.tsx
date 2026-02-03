import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BuildIcon from '@mui/icons-material/Build';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';

const mainNavItems = [
  { text: 'Dashboard', icon: <DashboardIcon fontSize="small" />, path: '/dashboard' },
  { text: 'Tools', icon: <BuildIcon fontSize="small" />, path: '/tools' },
];

const hamburgerNavItems = [
  { text: 'About', icon: <InfoIcon fontSize="small" />, path: '/about' },
  { text: 'Help', icon: <HelpIcon fontSize="small" />, path: '/help' },
];

const TopBar: React.FC = () => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setMenuAnchor(e.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const handleNav = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ backgroundColor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Toolbar sx={{ gap: 1 }}>
        {/* Logo + Brand */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', mr: 1 }}
          onClick={() => handleNav('/dashboard')}
        >
          <Box
            component="img"
            src="/images/logo-icon.png"
            alt="AI Client"
            sx={{ width: 36, height: 36 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '0.04em' }}>
            AI Client
          </Typography>
        </Box>

        {/* Main nav links — visible on sm+ screens */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.5, ml: 1 }}>
          {mainNavItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Button
                key={item.text}
                onClick={() => handleNav(item.path)}
                startIcon={item.icon}
                sx={{
                  color: active ? 'primary.dark' : 'text.secondary',
                  fontWeight: active ? 700 : 500,
                  borderRadius: 8,
                  px: 2,
                  py: 1,
                  backgroundColor: active ? 'rgba(0,188,212,0.08)' : 'transparent',
                  '&:hover': { backgroundColor: 'rgba(0,188,212,0.06)' },
                }}
              >
                {item.text}
              </Button>
            );
          })}
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Hamburger menu trigger */}
        <IconButton onClick={handleMenuOpen} sx={{ color: 'text.primary' }}>
          <MenuIcon />
        </IconButton>

        {/* Dropdown menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              borderRadius: 12,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              minWidth: 190,
              border: '1px solid',
              borderColor: 'divider',
              py: 1,
            },
          }}
        >
          {/* Mobile-only: main nav items */}
          {mainNavItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <MenuItem
                key={item.text}
                onClick={() => handleNav(item.path)}
                sx={{ display: { xs: 'flex', sm: 'none' }, py: 1, px: 2 }}
              >
                <ListItemIcon sx={{ color: active ? 'primary.main' : 'text.secondary', minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: active ? 700 : 500,
                    color: active ? '#00bcd4' : '#1a2332',
                  }}
                />
              </MenuItem>
            );
          })}

          {/* Divider between sections — mobile only */}
          <Divider sx={{ display: { xs: 'block', sm: 'none' }, my: 0.5 }} />

          {/* About & Help — always visible in hamburger */}
          {hamburgerNavItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <MenuItem
                key={item.text}
                onClick={() => handleNav(item.path)}
                sx={{ py: 1, px: 2 }}
              >
                <ListItemIcon sx={{ color: active ? 'primary.main' : 'text.secondary', minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: active ? 700 : 500,
                    color: active ? '#00bcd4' : '#1a2332',
                  }}
                />
              </MenuItem>
            );
          })}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
