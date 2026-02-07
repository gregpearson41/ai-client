import { useState, useEffect } from 'react';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CodeIcon from '@mui/icons-material/Code';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { api, HealthResponse, RootResponse } from '../../services/api';
import { SvgIcon } from '@mui/material';

export interface StatCardProps {
  title: string;
  value: string;
  icon: typeof SvgIcon;
  color: string;
  progress?: number;
}

const useDashboardPage = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState(false);
  const [healthLoading, setHealthLoading] = useState(true);
  const [apiInfo, setApiInfo] = useState<RootResponse | null>(null);
  const [lastChecked, setLastChecked] = useState<string>('');

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await api.health();
        setHealth(data);
        setHealthError(false);
        setLastChecked(new Date().toLocaleTimeString());
      } catch {
        setHealthError(true);
        setLastChecked(new Date().toLocaleTimeString());
      } finally {
        setHealthLoading(false);
      }
    };

    const fetchInfo = async () => {
      try {
        const data = await api.root();
        setApiInfo(data);
      } catch {
        // silently fail — widget stays in loading state
      }
    };

    fetchHealth();
    fetchInfo();

    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const stats: StatCardProps[] = [
    { title: 'Uptime',        value: '99.9%',               icon: CloudDoneIcon,  color: '#4caf50', progress: 99 },
    { title: 'API Version',  value: apiInfo?.version || '—', icon: CodeIcon,       color: '#00bcd4' },
    { title: 'Response Time', value: '12 ms',               icon: SpeedIcon,      color: '#ff9800', progress: 88 },
    { title: 'Growth',       value: '+18%',                  icon: TrendingUpIcon, color: '#9c27b0', progress: 72 },
  ];

  return {
    health,
    healthError,
    healthLoading,
    apiInfo,
    lastChecked,
    stats,
  };
};

export default useDashboardPage;
