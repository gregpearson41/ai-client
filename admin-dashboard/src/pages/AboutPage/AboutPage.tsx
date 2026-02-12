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
 
       
    </Box>
  );
};

export default AboutPage;
