import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  CircularProgress,
  SvgIcon,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CodeIcon from '@mui/icons-material/Code';
import SpeedIcon from '@mui/icons-material/Speed';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { api, HealthResponse, RootResponse } from '../services/api';

interface StatCardProps {
  title: string;
  value: string;
  icon: typeof SvgIcon;
  color: string;
  progress?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, progress }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 10,
            background: `${color}15`,
            border: `1px solid ${color}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon sx={{ color, fontSize: 26 }} />
        </Box>
      </Box>
      {progress !== undefined && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: `${color}18`,
              '& .MuiLinearProgress-bar': { backgroundColor: color, borderRadius: 3 },
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {progress}% of target
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

const DashboardPage: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState(false);
  const [healthLoading, setHealthLoading] = useState(true);
  const [apiInfo, setApiInfo] = useState<RootResponse | null>(null);
  const [lastChecked, setLastChecked] = useState<string>('');

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await api.health();
        setHealth(data);
        setHealthError(false);
        setLastChecked(new Date().toLocaleTimeString());
      } catch {
        setHealthError(true);
        setLastChecked(new Date().toLocaleTimeString());
      } finally {
        setHealthLoading(false);
      }
    };

    const fetchInfo = async () => {
      try {
        const data = await api.root();
        setApiInfo(data);
      } catch {
        // silently fail — widget stays in loading state
      }
    };

    fetchHealth();
    fetchInfo();

    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { title: 'Uptime',        value: '99.9%',               icon: CloudDoneIcon,  color: '#4caf50', progress: 99 },
    { title: 'API Version',  value: apiInfo?.version || '—', icon: CodeIcon,       color: '#00bcd4' },
    { title: 'Response Time', value: '12 ms',               icon: SpeedIcon,      color: '#ff9800', progress: 88 },
    { title: 'Growth',       value: '+18%',                  icon: TrendingUpIcon, color: '#9c27b0', progress: 72 },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Monitor your services and explore available tools.
      </Typography>

      {/* Health Monitor + API Info row */}
      <Grid container spacing={3}>
        {/* Health Monitor Widget */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Backend Health Monitor
              </Typography>
              {!healthLoading && (
                <Chip
                  icon={healthError ? <ErrorIcon /> : <CheckCircleIcon />}
                  label={healthError ? 'Offline' : 'Online'}
                  color={healthError ? 'error' : 'success'}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>

            {healthLoading ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <CircularProgress size={28} sx={{ color: '#00bcd4' }} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                  Checking backend…
                </Typography>
              </Box>
            ) : health ? (
              <Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                  <Box sx={{ flex: 1, minWidth: 120, p: 2, bgcolor: '#f0faf9', borderRadius: 10, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Service</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0097a7', mt: 0.3 }}>
                      {health.service}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 120, p: 2, bgcolor: '#f0faf9', borderRadius: 10, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Status</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50', mt: 0.3 }}>
                      {health.status.charAt(0).toUpperCase() + health.status.slice(1)}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 120, p: 2, bgcolor: '#f0faf9', borderRadius: 10, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Last Check</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mt: 0.3 }}>
                      {lastChecked}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Auto-refreshes every 10 s · Server time: {new Date(health.timestamp).toLocaleString()}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ py: 3, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 10 }}>
                <Typography variant="body2" color="text.secondary">
                  Backend is currently unreachable. It will retry automatically.
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>

        {/* API Info Widget */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
              API Information
            </Typography>
            {apiInfo ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>
                {[
                  { label: 'Message',       value: apiInfo.message },
                  { label: 'Version',       value: apiInfo.version },
                  { label: 'Documentation', value: apiInfo.documentation },
                ].map((row, i) => (
                  <Box
                    key={row.label}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1.5,
                      ...(i < 2 && { borderBottom: '1px solid', borderColor: 'divider' }),
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">{row.label}</Typography>
                    {row.label === 'Version' ? (
                      <Chip label={row.value} size="small" color="primary" variant="outlined" />
                    ) : (
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', textAlign: 'right', maxWidth: '60%' }}>
                        {row.value}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ py: 4, textAlign: 'center', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={24} sx={{ color: '#00bcd4' }} />
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Stats row */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardPage;
