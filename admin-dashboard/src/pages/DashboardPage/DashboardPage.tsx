import React from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
} from '@mui/material';
import useDashboardPage from './useDashboardPage';

const DashboardPage: React.FC = () => {
  const { user, logins, loginsLoading, loginsError } = useDashboardPage();

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#fff', fontWeight: 700 }}>
          Welcome back, <span style={{ color: '#00bcd4' }}>{user?.name}</span>
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your dashboard today.
        </Typography>
      </Box>

      {/* Login Tracker Table */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
          Login Activity
        </Typography>

        {loginsLoading ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <CircularProgress size={28} sx={{ color: '#00bcd4' }} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              Loading login records…
            </Typography>
          </Box>
        ) : loginsError ? (
          <Box sx={{ py: 3, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Unable to load login records.
            </Typography>
          </Box>
        ) : logins.length === 0 ? (
          <Box sx={{ py: 3, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              No login records found.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Time Logged In</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logins.map((login) => (
                  <TableRow key={login._id} hover>
                    <TableCell>{login.name}</TableCell>
                    <TableCell>{login.email}</TableCell>
                    <TableCell>
                      <Chip label={login.role} size="small" variant="outlined" color="primary" />
                    </TableCell>
                    <TableCell>{new Date(login.timeLoggedIn).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </Box>
  );
};

export default DashboardPage;
