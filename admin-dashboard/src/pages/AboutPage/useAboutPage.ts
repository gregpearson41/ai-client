import { SvgIcon } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import DevicesIcon from '@mui/icons-material/Devices';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

export interface Feature {
  icon: typeof SvgIcon;
  title: string;
  description: string;
}

const useAboutPage = () => {
  const features: Feature[] = [
    {
      icon: SecurityIcon,
      title: 'Secure Authentication',
      description: 'JWT-based authentication with secure token handling and automatic session management.'
    },
    {
      icon: SpeedIcon,
      title: 'High Performance',
      description: 'Built with React and optimized for speed with efficient state management.'
    },
    {
      icon: DevicesIcon,
      title: 'Responsive Design',
      description: 'Fully responsive Material UI design that works on desktop, tablet, and mobile.'
    },
    {
      icon: SupportAgentIcon,
      title: '24/7 Support',
      description: 'Dedicated support team ready to help you with any questions or issues.'
    }
  ];

  const techStack = [
    'React 18',
    'TypeScript',
    'Material UI',
    'React Router',
    'JWT Authentication',
    'Context API'
  ];

  return {
    features,
    techStack,
  };
};

export default useAboutPage;
