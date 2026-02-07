import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import useAboutPage from './useAboutPage';

const AboutPage: React.FC = () => {
  const { features, techStack } = useAboutPage();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
        About
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Learn more about the AI Client platform.
      </Typography>

      {/* Hero card with logo */}
      <Card sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            component="img"
            src="/images/logo-circle.png"
            alt="AI Client"
            sx={{ width: 52, height: 52 }}
          />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
            AI Client Platform
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" paragraph>
          The AI Client platform is a modern, lightweight dashboard designed to give end users quick access
          to powerful tools and live service monitoring — no login or setup required.
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          It connects seamlessly to the TechLifeCorp backend, providing real-time health checks
          and API information in a clean, intuitive interface.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
          Technology Stack
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {techStack.map((tech) => (
            <Chip key={tech} label={tech} variant="outlined" color="primary" />
          ))}
        </Box>
      </Card>

      {/* Features grid */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
        Key Features
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={feature.title}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: 'rgba(0,188,212,0.1)',
                      border: '1px solid rgba(0,188,212,0.25)',
                      color: '#00bcd4',
                      width: 56,
                      height: 56,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <Icon />
                  </Avatar>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Version info */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
          Version Information
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body2" color="text.secondary">Application</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>AI Client</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body2" color="text.secondary">Version</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>1.0.0</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body2" color="text.secondary">Last Updated</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>{new Date().toLocaleDateString()}</Typography>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default AboutPage;
