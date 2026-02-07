import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  MenuItem,
  CircularProgress,
  Checkbox,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyIcon from '@mui/icons-material/Key';
import { useAuth } from '../contexts/AuthContext';
import { api, ApiError } from '../services/api';
import { User } from '../types/auth';

const ROLES = ['App_Admin', 'Owner', 'Editor', 'Viewer'];

const roleColors: Record<string, string> = {
  'App_Admin': '#00bcd4',
  'Owner':     '#66bb6a',
  'Editor':    '#ffa726',
  'Viewer':    '#ce93d8',
};

interface UsersResponse {
  success: boolean;
  data: User[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

const UsersPage: React.FC = () => {
  const { user } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Viewer' });
  const [formError, setFormError]     = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting]   = useState(false);

  const [users, setUsers]           = useState<User[]>([]);
  const [loading, setLoading]       = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  /* ── delete state ── */
  const [selected, setSelected]         = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string[]>([]);
  const [deleting, setDeleting]         = useState(false);
  const [deleteError, setDeleteError]   = useState<string | null>(null);

  /* ── password change state ── */
  const [pwdTarget, setPwdTarget]         = useState<User | null>(null);
  const [pwdForm, setPwdForm]             = useState({ password: '', confirm: '' });
  const [pwdError, setPwdError]           = useState<string | null>(null);
  const [pwdSubmitting, setPwdSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await api.get<UsersResponse>('/api/users');
      setUsers(res.data);
    } catch (err) {
      setFetchError(err instanceof ApiError ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === 'App_Admin') {
      fetchUsers();
    }
  }, [user?.role, fetchUsers]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setSubmitting(true);
    try {
      await api.post('/api/users', form);
      setFormSuccess(`User ${form.email} created successfully`);
      setForm({ name: '', email: '', password: '', role: 'Viewer' });
      fetchUsers();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── select / delete helpers ── */
  const selectableIds = users.filter(u => u._id !== user?._id).map(u => u._id);
  const allSelected   = selectableIds.length > 0 && selectableIds.every(id => selected.has(id));
  const someSelected  = !allSelected && selectableIds.some(id => selected.has(id));

  const handleSelectAll = () => {
    setSelected(prev => {
      const next = new Set(prev);
      if (allSelected) {
        selectableIds.forEach(id => next.delete(id));
      } else {
        selectableIds.forEach(id => next.add(id));
      }
      return next;
    });
  };

  const handleSelectRow = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openDeleteConfirm = (ids: string[]) => {
    setDeleteTarget(ids);
    setDeleteError(null);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    const results = await Promise.allSettled(
      deleteTarget.map(id => api.delete(`/api/users/${id}`))
    );
    const failed = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected');
    if (failed.length > 0) {
      const msg = failed
        .map(r => (r.reason instanceof ApiError ? r.reason.message : 'Unknown error'))
        .join('; ');
      setDeleteError(`Failed to delete ${failed.length} user(s): ${msg}`);
    }
    setDeleting(false);
    setConfirmOpen(false);
    setSelected(new Set());
    fetchUsers();
  };

  /* ── password change helpers ── */
  const openPwdDialog = (u: User) => {
    setPwdTarget(u);
    setPwdForm({ password: '', confirm: '' });
    setPwdError(null);
  };

  const handlePwdSubmit = async () => {
    if (pwdForm.password.length < 6) {
      setPwdError('Password must be at least 6 characters');
      return;
    }
    if (pwdForm.password !== pwdForm.confirm) {
      setPwdError('Passwords do not match');
      return;
    }
    setPwdSubmitting(true);
    setPwdError(null);
    try {
      await api.patch(`/api/users/${pwdTarget!._id}/password`, { password: pwdForm.password });
      setPwdTarget(null);
    } catch (err) {
      setPwdError(err instanceof ApiError ? err.message : 'Failed to change password');
    } finally {
      setPwdSubmitting(false);
    }
  };

  /* ── access guard ── */
  if (user?.role !== 'App_Admin') {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#fff', fontWeight: 700 }}>
          User Management
        </Typography>
        <Alert severity="error" sx={{ mt: 2 }}>
          Access denied. Only App_Admin users can manage users.
        </Alert>
      </Box>
    );
  }

  const targetUsers = users.filter(u => deleteTarget.includes(u._id));

  /* ── main page ── */
  return (
    <Box>
      {/* header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#fff', fontWeight: 700 }}>
          User Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create and manage user accounts across the platform.
        </Typography>
      </Box>

      {/* add-user form */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
          <PersonAddIcon sx={{ color: '#00bcd4', fontSize: 22 }} />
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
            Add New User
          </Typography>
        </Box>

        {formError   && <Alert severity="error"   sx={{ mb: 2 }}>{formError}</Alert>}
        {formSuccess && <Alert severity="success" sx={{ mb: 2 }}>{formSuccess}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Name"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
                helperText="Minimum 6 characters"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Role"
                select
                value={form.role}
                onChange={(e) => handleChange('role', e.target.value)}
                required
              >
                {ROLES.map(role => (
                  <MenuItem key={role} value={role}>{role}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                sx={{ minWidth: 140 }}
              >
                {submitting ? 'Creating…' : 'Create User'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* existing users table */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
            Existing Users
          </Typography>

          {selected.size > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                {selected.size} selected
              </Typography>
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => openDeleteConfirm(Array.from(selected))}
                disabled={deleting}
                sx={{ minWidth: 140 }}
              >
                Delete Selected
              </Button>
            </Box>
          )}
        </Box>

        {deleteError && <Alert severity="error" sx={{ mb: 2 }}>{deleteError}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#00bcd4' }} />
          </Box>
        ) : fetchError ? (
          <Alert severity="error">{fetchError}</Alert>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ borderColor: 'rgba(0,188,212,0.12)', width: 52 }}>
                    <Checkbox
                      size="small"
                      checked={allSelected}
                      indeterminate={someSelected}
                      onChange={handleSelectAll}
                      disabled={selectableIds.length === 0}
                      sx={{
                        color: 'rgba(255,255,255,0.45)',
                        '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: '#00bcd4' },
                      }}
                    />
                  </TableCell>
                  {['Name', 'Email', 'Role', 'Status', ''].map(head => (
                    <TableCell
                      key={head}
                      sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(0,188,212,0.12)', fontWeight: 600 }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => {
                  const isSelf = u._id === user?._id;
                  return (
                    <TableRow
                      key={u._id}
                      sx={{
                        '& td': { borderColor: 'rgba(0,188,212,0.08)' },
                        ...(selected.has(u._id) && { backgroundColor: 'rgba(0,188,212,0.06)' }),
                      }}
                    >
                      <TableCell>
                        <Checkbox
                          size="small"
                          checked={selected.has(u._id)}
                          onChange={() => handleSelectRow(u._id)}
                          disabled={isSelf}
                          sx={{
                            color: 'rgba(255,255,255,0.45)',
                            '&.Mui-checked': { color: '#00bcd4' },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#e0e0e0' }}>
                        {u.name}
                        {isSelf && (
                          <Chip
                            label="You"
                            size="small"
                            sx={{
                              ml: 1,
                              fontSize: '0.65rem',
                              backgroundColor: 'rgba(0,188,212,0.15)',
                              color: '#00bcd4',
                              border: '1px solid rgba(0,188,212,0.3)',
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.6)' }}>{u.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={u.role}
                          size="small"
                          sx={{
                            backgroundColor: `${roleColors[u.role] || '#fff'}18`,
                            color: roleColors[u.role] || '#fff',
                            border: `1px solid ${roleColors[u.role] || '#fff'}40`,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={u.isActive ? 'Active' : 'Inactive'}
                          size="small"
                          sx={{
                            backgroundColor: u.isActive ? 'rgba(102,187,106,0.15)' : 'rgba(239,83,80,0.15)',
                            color:           u.isActive ? '#66bb6a'                 : '#ef5350',
                            border: `1px solid ${u.isActive ? 'rgba(102,187,106,0.3)' : 'rgba(239,83,80,0.3)'}`,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => openPwdDialog(u)}
                            disabled={deleting || pwdSubmitting}
                            sx={{
                              color: 'rgba(255,255,255,0.4)',
                              '&:hover': { color: '#00bcd4', backgroundColor: 'rgba(0,188,212,0.1)' },
                            }}
                          >
                            <KeyIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => openDeleteConfirm([u._id])}
                            disabled={isSelf || deleting}
                            sx={{
                              color: 'rgba(239,83,80,0.6)',
                              '&:hover': { color: '#ef5350', backgroundColor: 'rgba(239,83,80,0.1)' },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {users.length === 0 && (
              <Typography sx={{ py: 3, textAlign: 'center', color: 'rgba(255,255,255,0.35)' }}>
                No users found.
              </Typography>
            )}
          </TableContainer>
        )}
      </Paper>

      {/* confirmation dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 12,
              backgroundColor: '#0e1a2e',
              border: '1px solid rgba(0,188,212,0.15)',
            },
          },
        }}
      >
        <DialogTitle sx={{ color: '#fff', fontWeight: 600 }}>
          {deleteTarget.length === 1 ? 'Delete User' : `Delete ${deleteTarget.length} Users`}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1.5 }}>
            {deleteTarget.length === 1
              ? 'Are you sure you want to delete this user? This action cannot be undone.'
              : `Are you sure you want to delete these ${deleteTarget.length} users? This action cannot be undone.`}
          </Typography>
          {targetUsers.length > 0 && (
            <Box sx={{ mt: 1, maxHeight: 160, overflowY: 'auto' }}>
              {targetUsers.map(u => (
                <Box
                  key={u._id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    py: 0.75,
                    borderBottom: '1px solid rgba(0,188,212,0.08)',
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#e0e0e0', fontWeight: 600 }}>{u.name}</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)' }}>{u.email}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            sx={{ minWidth: 100 }}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* password-change dialog */}
      <Dialog
        open={pwdTarget !== null}
        onClose={() => setPwdTarget(null)}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 12,
              backgroundColor: '#0e1a2e',
              border: '1px solid rgba(0,188,212,0.15)',
            },
          },
        }}
      >
        <DialogTitle sx={{ color: '#fff', fontWeight: 600 }}>
          Change Password
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
            Set a new password for <span style={{ color: '#fff', fontWeight: 600 }}>{pwdTarget?.name}</span> ({pwdTarget?.email})
          </Typography>

          {pwdError && <Alert severity="error" sx={{ mb: 1.5 }}>{pwdError}</Alert>}

          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={pwdForm.password}
            onChange={(e) => setPwdForm(prev => ({ ...prev, password: e.target.value }))}
            helperText="Minimum 6 characters"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={pwdForm.confirm}
            onChange={(e) => setPwdForm(prev => ({ ...prev, confirm: e.target.value }))}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPwdTarget(null)} sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Cancel
          </Button>
          <Button
            onClick={handlePwdSubmit}
            variant="contained"
            disabled={pwdSubmitting}
            sx={{ minWidth: 100 }}
          >
            {pwdSubmitting ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;
