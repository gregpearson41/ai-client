import { SvgIcon } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useAuth } from '../../contexts/AuthContext';

export interface StatCardProps {
  title: string;
  value: string;
  icon: typeof SvgIcon;
  color: string;
  progress?: number;
}

export const quickStats = [
  { label: 'Active Sessions',  value: '342' },
  { label: 'Pending Tasks',    value: '28' },
  { label: 'New Messages',     value: '12' },
  { label: 'Support Tickets',  value: '5' },
];

const useDashboardPage = () => {
  const { user } = useAuth();

  const stats: StatCardProps[] = [
    { title: 'Total Users',  value: '2,543',   icon: PeopleIcon,       color: '#42a5f5', progress: 75 },
    { title: 'Orders',       value: '1,234',   icon: ShoppingCartIcon, color: '#66bb6a', progress: 60 },
    { title: 'Revenue',      value: '$45,678', icon: AttachMoneyIcon,  color: '#ffa726', progress: 85 },
    { title: 'Growth',       value: '+23%',    icon: TrendingUpIcon,   color: '#ce93d8', progress: 90 },
  ];

  return {
    user,
    stats,
  };
};

export default useDashboardPage;
