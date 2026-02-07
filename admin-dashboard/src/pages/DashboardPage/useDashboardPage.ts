import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

interface LoginRecord {
  _id: string;
  email: string;
  name: string;
  role: string;
  timeLoggedIn: string;
}

interface LoginTrackerResponse {
  success: boolean;
  count: number;
  data: LoginRecord[];
}

const useDashboardPage = () => {
  const { user } = useAuth();
  const [logins, setLogins] = useState<LoginRecord[]>([]);
  const [loginsLoading, setLoginsLoading] = useState(true);
  const [loginsError, setLoginsError] = useState(false);

  useEffect(() => {
    const fetchLogins = async () => {
      try {
        const res = await api.get<LoginTrackerResponse>('/api/login-tracker');
        setLogins(res.data);
        setLoginsError(false);
      } catch {
        setLoginsError(true);
      } finally {
        setLoginsLoading(false);
      }
    };
    fetchLogins();
  }, []);

  return {
    user,
    logins,
    loginsLoading,
    loginsError,
  };
};

export default useDashboardPage;
