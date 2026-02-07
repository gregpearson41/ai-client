import React, { useState } from 'react';
import { SvgIcon } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import ChatIcon from '@mui/icons-material/Chat';
import ArticleIcon from '@mui/icons-material/Article';

export interface FAQ {
  question: string;
  answer: string;
  category: string;
}

export interface SupportOption {
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

const useHelpPage = () => {
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

  return {
    searchTerm,
    setSearchTerm,
    expanded,
    filteredFaqs,
    supportOptions,
    handleAccordionChange,
  };
};

export default useHelpPage;
