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
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import useChatEnginePage from './useChatEnginePage';

import { IceSkating, Message } from '@mui/icons-material';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const ChatEnginePage: React.FC = () => {
  const {
    engines,
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
    handleToggleStatus,
    handleCancelEdit,
  } = useChatEnginePage();

  const [manageOpen, setManageOpen] = useState(true);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Chat Engine Management
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Configure and manage AI chat engines for the platform.
      </Typography>

      {/* Create / Edit Chat Engine Form */}
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
            <SmartToyIcon/> 
          </Box>
          <Typography variant="h5">
            {editingId ? 'Edit Chat Engine' : 'Add Chat Engine'}
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
            label="Engine Name"
            value={formData.engine_name}
            onChange={(e) => handleFormChange('engine_name', e.target.value)}
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
            minRows={2}
          />
          <TextField
            label="API Key"
            value={formData.api_key}
            onChange={(e) => handleFormChange('api_key', e.target.value)}
            disabled={submitting}
            fullWidth
            required
          />
          <TextField
            label="Chat API URL"
            value={formData.chat_apiUrl}
            onChange={(e) => handleFormChange('chat_apiUrl', e.target.value)}
            disabled={submitting}
            fullWidth
            placeholder="https://api.openai.com/v1/chat/completions"
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.active}
                onChange={(e) => handleFormChange('active', e.target.checked)}
                disabled={submitting}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#00bcd4' },
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
              sx={{ minWidth: 160 }}
            >
              {submitting ? (
                <CircularProgress size={22} sx={{ color: '#fff' }} />
              ) : editingId ? (
                'Update Engine'
              ) : (
                'Add Engine'
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

      {/* Manage Chat Engines Table */}
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
            Manage Chat Engines
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
                  Loading chat engines...
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
                  Unable to load chat engines.
                </Typography>
              </Box>
            ) : engines.length === 0 ? (
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
                  No chat engines found. Add one above to get started.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Engine Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>API Key</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Chat API URL</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Created</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {engines.map((engine) => (
                      <TableRow
                        key={engine._id}
                        hover
                        sx={{
                          bgcolor:
                            editingId === engine._id
                              ? 'rgba(0,188,212,0.08)'
                              : 'transparent',
                        }}
                      >
                        <TableCell>
                          <Chip
                            label={engine.engine_name}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            maxWidth: 250,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {engine.description || '—'}
                        </TableCell>
                        <TableCell
                          sx={{
                            maxWidth: 180,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontFamily: 'monospace',
                            fontSize: '0.8rem',
                          }}
                        >
                          {engine.api_key.slice(0, 8)}{'••••••••'}
                        </TableCell>
                        <TableCell
                          sx={{
                            maxWidth: 220,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontFamily: 'monospace',
                            fontSize: '0.8rem',
                          }}
                        >
                          {engine.chat_apiUrl || '—'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={engine.active ? 'Active' : 'Inactive'}
                            size="small"
                            sx={{
                              bgcolor: engine.active
                                ? 'rgba(76,175,80,0.15)'
                                : 'rgba(244,67,54,0.15)',
                              color: engine.active ? '#4caf50' : '#f44336',
                              borderColor: engine.active
                                ? 'rgba(76,175,80,0.4)'
                                : 'rgba(244,67,54,0.4)',
                            }}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(engine.creation_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => handleToggleStatus(engine._id)}
                            sx={{
                              color: engine.active ? '#4caf50' : 'rgba(255,255,255,0.3)',
                            }}
                            title={engine.active ? 'Deactivate' : 'Activate'}
                          >
                            <PowerSettingsNewIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(engine)}
                            sx={{ color: '#00bcd4' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(engine._id)}
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

export default ChatEnginePage;
