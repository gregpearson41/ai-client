import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import SplashScreen from './components/SplashScreen';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import HelpPage from './pages/HelpPage';
import AIPage from './pages/AI-Prompt';
import ChatEnginePage from './pages/ChatEngine';
import TopicsPage from './pages/Topics';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00bcd4',
      light: '#5ddef4',
      dark: '#008ba3'
    },
    secondary: {
      main: '#00bcd4',
      light: '#5ddef4',
      dark: '#008ba3'
    },
    background: {
      default: '#0a1628',
      paper: '#0e1a2e'
    },
    text: {
      primary: '#e0e0e0',
      secondary: 'rgba(255,255,255,0.5)'
    },
    divider: 'rgba(0,188,212,0.12)'
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(10,20,40,0.55)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(0,188,212,0.12)',
          borderRadius: 12,
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(10,20,40,0.55)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(0,188,212,0.12)',
          borderRadius: 12,
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(8,15,30,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,188,212,0.15)',
          boxShadow: 'none',
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(8,15,30,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(0,188,212,0.15)',
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0,188,212,0.15)'
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(10,20,40,0.4)',
          border: '1px solid rgba(0,188,212,0.1)',
          borderRadius: '10px !important',
          margin: '6px 0',
          boxShadow: 'none',
          '&::before': { display: 'none' },
          '&.Mui-expanded': {
            borderColor: 'rgba(0,188,212,0.25)',
            margin: '6px 0',
          },
        }
      }
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          color: '#e0e0e0',
          '&.Mui-expanded': { color: '#fff' },
          '& .MuiAccordionSummary-expandIconWrapper': {
            color: 'rgba(0,188,212,0.6)'
          }
        }
      }
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          color: 'rgba(255,255,255,0.55)',
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: 'rgba(255,255,255,0.65)',
          '&.Mui-selected': {
            backgroundColor: 'rgba(0,188,212,0.12)',
            color: '#fff',
            '&:hover': { backgroundColor: 'rgba(0,188,212,0.18)' }
          },
          '&:hover': { backgroundColor: 'rgba(0,188,212,0.07)' }
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: { color: 'rgba(255,255,255,0.45)' }
      }
    },
    MuiChip: {
      styleOverrides: {
        outlined: {
          borderColor: 'rgba(0,188,212,0.4)',
          color: '#5ddef4',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
        outlined: {
          borderColor: 'rgba(0,188,212,0.4)',
          color: '#00bcd4',
          '&:hover': {
            borderColor: 'rgba(0,188,212,0.7)',
            backgroundColor: 'rgba(0,188,212,0.08)',
          }
        },
        contained: {
          background: 'linear-gradient(135deg, #00bcd4, #0097a7)',
          color: '#fff',
          boxShadow: '0 2px 12px rgba(0,188,212,0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #00d4e8, #00bcd4)',
            boxShadow: '0 2px 18px rgba(0,188,212,0.45)',
          }
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(12,22,42,0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(0,188,212,0.15)',
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#e0e0e0',
          '&:hover': { backgroundColor: 'rgba(0,188,212,0.1)' },
          '&.Mui-disabled': { color: 'rgba(255,255,255,0.4)' }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '& fieldset': { borderColor: 'rgba(0,188,212,0.2)' },
            '&:hover fieldset': { borderColor: 'rgba(0,188,212,0.45)' },
            '&.Mui-focused fieldset': {
              borderColor: 'rgba(0,188,212,0.7)',
              boxShadow: '0 0 10px rgba(0,188,212,0.15)',
            }
          },
          '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.45)' },
          '& .MuiInputLabel-root.Mui-focused': { color: 'rgba(0,188,212,0.85)' },
          '& .MuiInputBase-input': { color: '#e0e0e0' }
        }
      }
    },
  }
});

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (showSplash) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SplashScreen onComplete={handleSplashComplete} duration={10000} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="ai-prompt" element={<AIPage />} />
              <Route path="chat-engines" element={<ChatEnginePage />} />
              <Route path="topics" element={<TopicsPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="help" element={<HelpPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
