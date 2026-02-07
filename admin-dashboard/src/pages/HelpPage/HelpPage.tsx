import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import useHelpPage from './useHelpPage';

const HelpPage: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    expanded,
    filteredFaqs,
    supportOptions,
    handleAccordionChange,
  } = useHelpPage();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Help Center
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Find answers to common questions or reach out to our support team.
      </Typography>

       

      <Typography variant="h5" gutterBottom>
        Frequently Asked Questions
      </Typography>
      <Box sx={{ mb: 4 }}>
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <Accordion
              key={faq.question}
              expanded={expanded === `panel${index}`}
              onChange={handleAccordionChange(`panel${index}`)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
                    [{faq.category}]
                  </Typography>
                  <Typography>{faq.question}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No results found for "{searchTerm}". Try a different search term.
            </Typography>
          </Paper>
        )}
      </Box>

      <Typography variant="h5" gutterBottom>
        Contact Support
      </Typography>
      <Grid container spacing={3}>
        {supportOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Grid size={{ xs: 12, md: 4 }} key={option.title}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: 'rgba(0,188,212,0.1)',
                      border: '1px solid rgba(0,188,212,0.3)',
                      boxShadow: '0 0 12px rgba(0,188,212,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    <Icon sx={{ fontSize: 30, color: '#00bcd4' }} />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {option.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {option.description}
                  </Typography>
                  <Button variant="outlined" color="primary">
                    {option.action}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default HelpPage;
