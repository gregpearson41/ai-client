import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
} from '@mui/material';

const AIPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        AI Client Prompt
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        This page will be where the prompt will be used
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
            TLC
          </Box>
          <Typography variant="h5">
            Client Prompt
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" paragraph>

        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
            
        </Typography>

        <Divider sx={{ my: 3 }} />
      </Paper>
      <Grid container spacing={3}>

      </Grid>
    </Box>
  );
};

export default AIPage;
