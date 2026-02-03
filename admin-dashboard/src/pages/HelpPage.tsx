import React, { useState } from 'react';
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
  SvgIcon
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
    question: 'How do I reset my password?',
    answer: 'To reset your password, click on the "Forgot Password" link on the login page. Enter your email address and you will receive a password reset link. Follow the instructions in the email to create a new password.',
    category: 'Account'
  },
  {
    question: 'How do I update my profile information?',
    answer: 'Navigate to the Settings page from the sidebar menu. Click on "Profile" and you can update your name, email, and other personal information. Don\'t forget to save your changes.',
    category: 'Account'
  },
  {
    question: 'What browsers are supported?',
    answer: 'Our dashboard supports all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version of these browsers for the best experience.',
    category: 'Technical'
  },
  {
    question: 'How do I export data from the dashboard?',
    answer: 'Most tables and reports have an export button in the top-right corner. Click it to download your data in CSV, Excel, or PDF format depending on your preference.',
    category: 'Features'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we take security seriously. All data is encrypted in transit using TLS and at rest using AES-256 encryption. We also use JWT tokens for secure authentication.',
    category: 'Security'
  },
  {
    question: 'How do I contact support?',
    answer: 'You can reach our support team through the contact form below, by email at support@example.com, or through our live chat feature available during business hours.',
    category: 'Support'
  }
];

const supportOptions: SupportOption[] = [
  {
    icon: EmailIcon,
    title: 'Email Support',
    description: 'Send us an email and we\'ll respond within 24 hours.',
    action: 'support@example.com'
  },
  {
    icon: ChatIcon,
    title: 'Live Chat',
    description: 'Chat with our support team in real-time.',
    action: 'Start Chat'
  },
  {
    icon: ArticleIcon,
    title: 'Documentation',
    description: 'Browse our comprehensive documentation.',
    action: 'View Docs'
  }
];

const HelpPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleAccordionChange = (panel: string) => (
    _event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Help Center
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Find answers to common questions or reach out to our support team.
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search for help topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            )
          }}
        />
      </Paper>

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
