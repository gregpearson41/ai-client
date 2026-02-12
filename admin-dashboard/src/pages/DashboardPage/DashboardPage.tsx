import React, {useState} from 'react';
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
  IconButton,
  Collapse
} from '@mui/material';
import useDashboardPage from './useDashboardPage';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
 



const DashboardPage: React.FC = () => {
  const { user, logins, loginsLoading, loginsError } = useDashboardPage();
  const [open, setOpen] = useState(false);

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
<Card sx={{ p: 3,width: '100%',          // full width of parent
    maxWidth: 900,          // optional cap
    
    ml: 'auto'   }}>
  {/* Header */}
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
    }}
    onClick={() => setOpen(!open)}
  >
    <Typography variant="h6" sx={{ fontWeight: 700 }}>
      Login Activity
    </Typography>

    <IconButton size="small">
      <ExpandMoreIcon
        sx={{
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.25s ease',
        }}
      />
    </IconButton>
  </Box>

  {/* Collapsible Content */}
  <Collapse in={open} timeout="auto" unmountOnExit>
    <Box sx={{ mt: 2 }}>
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
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Time Logged In</TableCell>
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
                  <TableCell>
                    {new Date(login.timeLoggedIn).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  </Collapse>
</Card>

    </Box>
  );
};

export default DashboardPage;
