import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
import TopicIcon from '@mui/icons-material/Topic';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../contexts/AuthContext';
import Footer from './Footer';
import TimeClock from './TimeClock';
import AssistantTwoToneIcon from '@mui/icons-material/AssistantTwoTone';

const drawerWidth = 240;

interface NavItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'AI Prompt', icon: <AssistantTwoToneIcon />, path: '/ai-prompt' },
  { text: 'Chat Engines', icon: <SmartToyIcon />, path: '/chat-engines' },
  { text: 'Topics', icon: <TopicIcon />, path: '/topics' }
];

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [hamburgerAnchor, setHamburgerAnchor] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleHamburgerOpen = (event: React.MouseEvent<HTMLElement>) => {
    setHamburgerAnchor(event.currentTarget);
  };

  const handleHamburgerClose = () => {
    setHamburgerAnchor(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const drawer = (
    <Box>
      <Toolbar sx={{ gap: 1, py: 1.5 }}>
        <Box
          component="img"
          src="/images/logo-icon.png"
          alt="AI Client"
          sx={{
            width: 36,
            height: 36,
            filter: 'drop-shadow(0 0 6px rgba(0,188,212,0.4))',
          }}
        />
        <Typography variant="h6" noWrap component="div" sx={{
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '0.06em',
        }}>
          AI Client
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 8,
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(0,188,212,0.12)',
                  '&:hover': { backgroundColor: 'rgba(0,188,212,0.18)' }
                },
                '&:hover': { backgroundColor: 'rgba(0,188,212,0.07)' }
              }}
            >
              <ListItemIcon
                sx={{ color: location.pathname === item.path ? '#00bcd4' : 'rgba(255,255,255,0.45)' }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    color: location.pathname === item.path ? '#fff' : 'rgba(255,255,255,0.65)',
                    fontWeight: location.pathname === item.path ? 600 : 400
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />

      {/* Background gradient */}
      <Box sx={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: [
          'radial-gradient(ellipse at 15% 50%, rgba(0,60,100,0.3) 0%, transparent 55%)',
          'radial-gradient(ellipse at 85% 15%, rgba(0,90,70,0.2) 0%, transparent 55%)',
          'radial-gradient(ellipse at 50% 85%, rgba(25,0,55,0.3) 0%, transparent 55%)',
          'linear-gradient(145deg, #050c18 0%, #0a1628 50%, #080f1e 100%)',
        ].join(', '),
      }} />

      {/* Grid overlay */}
      <Box sx={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: [
          'linear-gradient(rgba(0,188,212,0.035) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(0,188,212,0.035) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '64px 64px',
      }} />

      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{
            flexGrow: 1,
            color: '#fff',
            letterSpacing: '0.04em',
          }}>
            {navItems.find((item) => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>
          <IconButton
            color="inherit"
            aria-label="navigation menu"
            onClick={handleHamburgerOpen}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <TimeClock variant="compact" showSeconds={true} />
            </Box>
            <Divider orientation="vertical" flexItem sx={{
              display: { xs: 'none', md: 'block' },
              borderColor: 'rgba(0,188,212,0.2)',
            }} />
            <Typography variant="body2" sx={{
              display: { xs: 'none', md: 'block' },
              color: 'rgba(255,255,255,0.7)',
            }}>
              {user?.name}
            </Typography>
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{ ml: 1 }}
              aria-controls={anchorEl ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={anchorEl ? 'true' : undefined}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(0,188,212,0.2)', color: '#00bcd4' }}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem disabled>
              <ListItemIcon>
                <PersonIcon fontSize="small" sx={{ color: 'rgba(0,188,212,0.6)' }} />
              </ListItemIcon>
              {user?.email}
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.5)' }} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>

          {/* Hamburger navigation – About & Help */}
          <Menu
            anchorEl={hamburgerAnchor}
            open={Boolean(hamburgerAnchor)}
            onClose={handleHamburgerClose}
            onClick={handleHamburgerClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => { handleHamburgerClose(); handleNavigation('/about'); }}>
              <ListItemIcon sx={{ color: location.pathname === '/about' ? '#00bcd4' : 'rgba(255,255,255,0.45)' }}>
                <InfoIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="About"
                sx={{
                  '& .MuiListItemText-primary': {
                    color: location.pathname === '/about' ? '#fff' : '#e0e0e0',
                    fontWeight: location.pathname === '/about' ? 600 : 400,
                  }
                }}
              />
            </MenuItem>
            <MenuItem onClick={() => { handleHamburgerClose(); handleNavigation('/help'); }}>
              <ListItemIcon sx={{ color: location.pathname === '/help' ? '#00bcd4' : 'rgba(255,255,255,0.45)' }}>
                <HelpIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Help"
                sx={{
                  '& .MuiListItemText-primary': {
                    color: location.pathname === '/help' ? '#fff' : '#e0e0e0',
                    fontWeight: location.pathname === '/help' ? 600 : 400,
                  }
                }}
              />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="navigation"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Toolbar />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
