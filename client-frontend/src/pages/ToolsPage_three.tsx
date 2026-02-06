import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';

const ToolsPage_three: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
        ToolsPage_three
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        This is where you put your quick blurb about this particular area
      </Typography>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 10,
                bgcolor: 'rgba(0,188,212,0.1)',
                border: '1px solid rgba(0,188,212,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BuildIcon sx={{ color: '#00bcd4', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                ToolsPage_three
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Placeholder for ToolsPage_three content
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" color="text.secondary">
            Content for ToolsPage_three goes here.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ToolsPage_three;
