import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import useDashboardPage, { StatCardProps, quickStats } from './useDashboardPage';

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, progress }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography color="text.secondary" variant="body2" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: '#fff' }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 8,
            background: `${color}20`,
            border: `1px solid ${color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon sx={{ color, fontSize: 28 }} />
        </Box>
      </Box>
      {progress !== undefined && (
        <Box sx={{ mt: 2.5 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: `${color}18`,
              '& .MuiLinearProgress-bar': {
                backgroundColor: color,
                borderRadius: 3,
                boxShadow: `0 0 8px ${color}50`,
              }
            }}
          />
          <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>
            {progress}% of target
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

const DashboardPage: React.FC = () => {
  const { user, stats } = useDashboardPage();

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#fff', fontWeight: 700 }}>
          Welcome back, <span style={{ color: '#00bcd4' }}>{user?.name}</span>
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your dashboard today.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>

        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#fff', fontWeight: 600 }}>
              Recent Activity
            </Typography>
            <Box sx={{ py: 5, textAlign: 'center', border: '1px dashed rgba(0,188,212,0.2)', borderRadius: 8 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.35)' }}>
                Activity chart would be displayed here.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.22)' }}>
                Integrate with a charting library like Chart.js or Recharts.
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#fff', fontWeight: 600 }}>
              Quick Stats
            </Typography>
            <Box sx={{ mt: 2 }}>
              {quickStats.map((item, i) => (
                <Box key={item.label} sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  py: 1.2,
                  ...(i < quickStats.length - 1 && { borderBottom: '1px solid rgba(0,188,212,0.08)' }),
                }}>
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
