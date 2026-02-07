import { SvgIcon } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import DevicesIcon from '@mui/icons-material/Devices';
import BuildIcon from '@mui/icons-material/Build';

export interface Feature {
  icon: typeof SvgIcon;
  title: string;
  description: string;
}

const useAboutPage = () => {
  const features: Feature[] = [
    {
      icon: SecurityIcon,
      title: 'Secure by Design',
      description: 'No login required for client tools. Backend communications use secure HTTPS connections.',
    },
    {
      icon: SpeedIcon,
      title: 'High Performance',
      description: 'Built with React 19 and optimised for speed. Real-time health monitoring with minimal latency.',
    },
    {
      icon: DevicesIcon,
      title: 'Responsive Design',
      description: 'Fully responsive Material UI layout — works seamlessly on desktop, tablet, and mobile.',
    },
    {
      icon: BuildIcon,
      title: 'Powerful Tools',
      description: 'Interactive utilities designed to make everyday tasks faster and more efficient.',
    },
  ];

  const techStack = ['React 19', 'TypeScript', 'Material UI v7', 'React Router v7'];

  return {
    features,
    techStack,
  };
};

export default useAboutPage;
