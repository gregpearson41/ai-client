import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface LocationState {
  from?: { pathname: string };
}

export const keyframes = `
  @keyframes gradientDrift {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }
  @keyframes pulse {
    0%, 100% { filter: drop-shadow(0 0 8px rgba(0,188,212,0.4)); }
    50%      { filter: drop-shadow(0 0 22px rgba(0,188,212,0.7)); }
  }
  @keyframes floatA {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-18px); }
  }
  @keyframes floatB {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-12px); }
  }
`;

export const particles = [
  { id: 'p1', top: '8%',  left: '12%', size: 2, dur: '6s',   delay: '0s',   alt: false },
  { id: 'p2', top: '18%', left: '78%', size: 3, dur: '8s',   delay: '1s',   alt: true  },
  { id: 'p3', top: '72%', left: '22%', size: 2, dur: '7s',   delay: '2s',   alt: false },
  { id: 'p4', top: '62%', left: '82%', size: 3, dur: '5.5s', delay: '0.5s', alt: true  },
  { id: 'p5', top: '88%', left: '58%', size: 2, dur: '9s',   delay: '1.5s', alt: false },
  { id: 'p6', top: '42%', left: '4%',  size: 4, dur: '6.5s', delay: '3s',   alt: true  },
  { id: 'p7', top: '52%', left: '92%', size: 2, dur: '7.5s', delay: '0.8s', alt: false },
  { id: 'p8', top: '30%', left: '45%', size: 2, dur: '10s',  delay: '2.5s', alt: true  },
];

export const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    color: '#e0e0e0',
    '& fieldset': { borderColor: 'rgba(0,188,212,0.25)' },
    '&:hover fieldset': { borderColor: 'rgba(0,188,212,0.5)' },
    '&.Mui-focused fieldset': {
      borderColor: 'rgba(0,188,212,0.8)',
      boxShadow: '0 0 12px rgba(0,188,212,0.2)',
    },
  },
  '& .MuiInputLabel-root': { color: 'rgba(0,188,212,0.6)' },
  '& .MuiInputLabel-root.Mui-focused': { color: 'rgba(0,188,212,0.9)' },
};

const useLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as LocationState)?.from?.pathname || '/dashboard';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid email or password. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isSubmitting,
    handleSubmit,
  };
};

export default useLoginPage;
