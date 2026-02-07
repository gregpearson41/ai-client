import { useState, useEffect } from 'react';
import { api, HealthResponse, RootResponse, SystemInfoResponse } from '../../services/api';

const useDashboardPage = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState(false);
  const [healthLoading, setHealthLoading] = useState(true);
  const [apiInfo, setApiInfo] = useState<RootResponse | null>(null);
  const [systemInfo, setSystemInfo] = useState<SystemInfoResponse['data'] | null>(null);
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

    const fetchSystemInfo = async () => {
      try {
        const data = await api.systemInfo();
        setSystemInfo(data.data);
      } catch {
        // silently fail — widget stays in loading state
      }
    };

    fetchHealth();
    fetchInfo();
    fetchSystemInfo();

    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  return {
    health,
    healthError,
    healthLoading,
    apiInfo,
    systemInfo,
    lastChecked,
  };
};

export default useDashboardPage;
