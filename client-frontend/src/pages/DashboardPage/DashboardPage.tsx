import React from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  Chip,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import useDashboardPage from './useDashboardPage';

const DashboardPage: React.FC = () => {
  const { health, healthError, healthLoading, apiInfo, systemInfo, lastChecked } = useDashboardPage();

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
            {apiInfo || systemInfo ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>
                {[
                  { label: 'Company Owner',   value: systemInfo?.companyOwner || '—' },
                  { label: 'Version',         value: apiInfo?.version || '—' },
                  { label: 'Build Number',    value: systemInfo?.buildNumber || '—' },
                ].map((row, i, arr) => (
                  <Box
                    key={row.label}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1.5,
                      ...(i < arr.length - 1 && { borderBottom: '1px solid', borderColor: 'divider' }),
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

    </Box>
  );
};

export default DashboardPage;
