import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import useAboutPage from './useAboutPage';

const AboutPage: React.FC = () => {
  const { features, techStack } = useAboutPage();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        About
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Learn more about TechLifeCorp and our Admin Dashboard application.
      </Typography>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              border: '1px solid rgba(0,188,212,0.5)',
              boxShadow: '0 0 10px rgba(0,188,212,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00bcd4',
              fontWeight: 700,
              fontSize: 18
            }}
          >
            TL
          </Box>
          <Typography variant="h5">
            TechLifeCorp Admin Dashboard
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" paragraph>
          TechLifeCorp's Admin Dashboard is a modern, feature-rich application built with React and TypeScript.
          It provides a comprehensive solution for managing your business operations with a clean,
          intuitive interface powered by Material UI.
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          The dashboard includes secure JWT authentication, responsive design, and a modular
          architecture that makes it easy to extend and customize for your specific needs.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Technology Stack
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {techStack.map((tech) => (
            <Chip key={tech} label={tech} variant="outlined" color="primary" />
          ))}
        </Box>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Key Features
      </Typography>
      <Grid container spacing={3}>
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={feature.title}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: 'rgba(0,188,212,0.15)',
                      border: '1px solid rgba(0,188,212,0.3)',
                      boxShadow: '0 0 12px rgba(0,188,212,0.2)',
                      color: '#00bcd4',
                      width: 56,
                      height: 56,
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    <Icon />
                  </Avatar>
                  <Typography variant="h6" gutterBottom>
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

      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Version Information
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Application Version
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              1.0.0
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Last Updated
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {new Date().toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AboutPage;
