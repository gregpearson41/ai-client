import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
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
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
        Help Center
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Find answers to common questions or get in touch with our team.
      </Typography>

      {/* Search bar */}
      <Card sx={{ p: 3, mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search help topics…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#00bcd4' }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Card>

      {/* FAQ section */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
        Frequently Asked Questions
      </Typography>
      <Box sx={{ mb: 4 }}>
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, i) => (
            <Accordion
              key={faq.question}
              expanded={expanded === `panel${i}`}
              onChange={handleAccordionChange(`panel${i}`)}
              sx={{
                mb: 1,
                borderRadius: '10px !important',
                border: '1px solid',
                borderColor: expanded === `panel${i}` ? 'primary.main' : 'divider',
                boxShadow: 'none',
                '&::before': { display: 'none' },
                '&.Mui-expanded': { margin: '0 0 8px !important' },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#00bcd4' }} />}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#0097a7',
                      fontWeight: 700,
                      bgcolor: 'rgba(0,188,212,0.1)',
                      px: 1.5,
                      py: 0.3,
                      borderRadius: 6,
                    }}
                  >
                    {faq.category}
                  </Typography>
                  <Typography sx={{ fontWeight: 500, color: 'text.primary' }}>{faq.question}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No results found for &quot;{searchTerm}&quot;. Try a different search term.
            </Typography>
          </Card>
        )}
      </Box>

      {/* Contact support */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
        Contact Support
      </Typography>
      <Grid container spacing={3}>
        {supportOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Grid size={{ xs: 12, md: 4 }} key={option.title}>
              <Card sx={{ height: '100%' }}>
                <CardContent
                  sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: 'rgba(0,188,212,0.08)',
                      border: '1px solid rgba(0,188,212,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <Icon sx={{ fontSize: 28, color: '#00bcd4' }} />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {option.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {option.description}
                  </Typography>
                  <Button variant="outlined" color="primary" sx={{ mt: 'auto' }}>
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
