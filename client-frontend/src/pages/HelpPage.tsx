import React, { useState } from 'react';
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
  SvgIcon,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from '@mui/icons-material/Email';
import ChatIcon from '@mui/icons-material/Chat';
import ArticleIcon from '@mui/icons-material/Article';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

interface SupportOption {
  icon: typeof SvgIcon;
  title: string;
  description: string;
  action: string;
}

const faqs: FAQ[] = [
  {
    question: 'Do I need to log in to use the client dashboard?',
    answer:
      'No. The AI Client dashboard is fully accessible without any login or authentication. Just open the app and start using the tools.',
    category: 'Getting Started',
  },
  {
    question: 'What is the Health Monitor widget?',
    answer:
      'The Health Monitor on the Dashboard page polls the backend API every 10 seconds to check if the service is running. It displays the current status, service name, and the time of the last successful check.',
    category: 'Features',
  },
  {
    question: 'How do the Text Utilities work?',
    answer:
      'On the Tools page, paste or type any text into the input area. Use the transformation buttons (UPPERCASE, lowercase, Title Case, etc.) to generate a transformed version in the output area. Click the copy icon to copy the result to your clipboard.',
    category: 'Tools',
  },
  {
    question: 'What browsers are supported?',
    answer:
      'The client dashboard supports all modern browsers: Chrome, Firefox, Safari, and Edge. We recommend using the latest version for the best experience.',
    category: 'Technical',
  },
  {
    question: 'How do I report an issue?',
    answer:
      'If you experience any issues, please contact our support team via email or use the live chat option below. Include as much detail as possible about what you were doing when the issue occurred.',
    category: 'Support',
  },
  {
    question: 'Is the backend always available?',
    answer:
      'The backend health status is shown in the Dashboard Health Monitor. If it displays "Offline", the backend may be temporarily unavailable. The widget auto-refreshes every 10 seconds and will update as soon as the service comes back online.',
    category: 'Technical',
  },
];

const supportOptions: SupportOption[] = [
  {
    icon: EmailIcon,
    title: 'Email Support',
    description: 'Send us an email and we\'ll get back to you within 24 hours.',
    action: 'support@example.com',
  },
  {
    icon: ChatIcon,
    title: 'Live Chat',
    description: 'Chat with our support team during business hours.',
    action: 'Start Chat',
  },
  {
    icon: ArticleIcon,
    title: 'Documentation',
    description: 'Browse API docs and technical guides.',
    action: 'View Docs',
  },
];

const HelpPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState<string | false>(false);

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              onChange={(_e, isExpanded) => setExpanded(isExpanded ? `panel${i}` : false)}
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
