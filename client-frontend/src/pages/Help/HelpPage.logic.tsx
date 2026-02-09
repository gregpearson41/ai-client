import { useState } from 'react';
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

export const faqs: FAQ[] = [
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

export const supportOptions: SupportOption[] = [
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

export interface HelpLogicState {
  searchTerm: string;
  expanded: string | false;
  filteredFaqs: FAQ[];
  supportOptions: SupportOption[];
  setSearchTerm: (term: string) => void;
  setExpanded: (panel: string | false) => void;
}

export const useHelpLogic = (): HelpLogicState => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState<string | false>(false);

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    searchTerm,
    expanded,
    filteredFaqs,
    supportOptions,
    setSearchTerm,
    setExpanded,
  };
};
