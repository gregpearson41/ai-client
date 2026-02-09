import { useState, useEffect } from 'react';
import { api, HealthResponse, RootResponse } from '../../services/api';

export interface DashboardLogicState {
  health: HealthResponse | null;
  healthError: boolean;
  healthLoading: boolean;
  apiInfo: RootResponse | null;
  lastChecked: string;
}

export const useDashboardLogic = (): DashboardLogicState => {
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

  return {
    health,
    healthError,
    healthLoading,
    apiInfo,
    lastChecked,
  };
};
