import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Chip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useTopicsPage from './useTopicsPage';

const TopicsPage: React.FC = () => {
  const {
    topics,
    loading,
    error,
    formData,
    submitting,
    submitError,
    submitSuccess,
    editingId,
    deleteError,
    handleFormChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleToggleActive,
    handleCancelEdit,
  } = useTopicsPage();

  const [manageOpen, setManageOpen] = useState(true);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Topics
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Create and manage topics for the AI client.
      </Typography>

      {/* Create / Edit Topic Form */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              border: '1px solid rgba(0,188,212,0.5)',
              boxShadow: '0 0 10px rgba(0,188,212,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00bcd4',
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            TLC
          </Box>
          <Typography variant="h5">
            {editingId ? 'Edit Topic' : 'Create Topic'}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}
        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {submitSuccess}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Topic Name"
            value={formData.topic_name}
            onChange={(e) => handleFormChange('topic_name', e.target.value)}
            disabled={submitting}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => handleFormChange('description', e.target.value)}
            disabled={submitting}
            fullWidth
            multiline
            minRows={3}
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.active}
                onChange={(e) => handleFormChange('active', e.target.checked)}
                disabled={submitting}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#00bcd4',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#00bcd4',
                  },
                }}
              />
            }
            label="Active"
            sx={{ color: 'rgba(255,255,255,0.7)' }}
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting}
              sx={{ minWidth: 140 }}
            >
              {submitting ? (
                <CircularProgress size={22} sx={{ color: '#fff' }} />
              ) : editingId ? (
                'Update Topic'
              ) : (
                'Create Topic'
              )}
            </Button>
            {editingId && (
              <Button variant="outlined" onClick={handleCancelEdit} disabled={submitting}>
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Manage Topics Table */}
      <Paper sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={() => setManageOpen(!manageOpen)}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Manage Topics
          </Typography>
          <IconButton size="small">
            <ExpandMoreIcon
              sx={{
                transform: manageOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.25s ease',
              }}
            />
          </IconButton>
        </Box>

        <Collapse in={manageOpen} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2 }}>
            {deleteError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {deleteError}
              </Alert>
            )}

            {loading ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <CircularProgress size={28} sx={{ color: '#00bcd4' }} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                  Loading topics...
                </Typography>
              </Box>
            ) : error ? (
              <Box
                sx={{
                  py: 3,
                  textAlign: 'center',
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Unable to load topics.
                </Typography>
              </Box>
            ) : topics.length === 0 ? (
              <Box
                sx={{
                  py: 3,
                  textAlign: 'center',
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No topics found. Create one above to get started.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Created By</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topics.map((topic) => (
                      <TableRow
                        key={topic._id}
                        hover
                        sx={{
                          bgcolor:
                            editingId === topic._id
                              ? 'rgba(0,188,212,0.08)'
                              : 'transparent',
                        }}
                      >
                        <TableCell>
                          <Chip
                            label={topic.topic_name}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            maxWidth: 280,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {topic.description || '—'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={topic.active ? 'Active' : 'Inactive'}
                            size="small"
                            variant="outlined"
                            onClick={() => handleToggleActive(topic)}
                            sx={{
                              cursor: 'pointer',
                              bgcolor: topic.active
                                ? 'rgba(76,175,80,0.15)'
                                : 'rgba(244,67,54,0.15)',
                              color: topic.active ? '#4caf50' : '#f44336',
                              borderColor: topic.active
                                ? 'rgba(76,175,80,0.4)'
                                : 'rgba(244,67,54,0.4)',
                            }}
                          />
                        </TableCell>
                        <TableCell>{topic.created_by}</TableCell>
                        <TableCell>
                          {new Date(topic.created_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(topic)}
                            sx={{ color: '#00bcd4' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(topic._id)}
                            sx={{ color: '#f44336' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Collapse>
      </Paper>
    </Box>
  );
};

export default TopicsPage;
