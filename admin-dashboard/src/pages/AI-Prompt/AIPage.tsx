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
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useAIPage from './useAIPage';
import { IceSkating, Message } from '@mui/icons-material';
import AssistantTwoToneIcon from '@mui/icons-material/AssistantTwoTone';

const AIPage: React.FC = () => {
  const {
    prompts,
    loading,
    error,
    chatEngines,
    enginesLoading,
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
    handleCancelEdit,
  } = useAIPage();

  const [manageOpen, setManageOpen] = useState(true);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        AI Client Prompt
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Create and manage prompts for the AI client.
      </Typography>

      {/* Create / Edit Prompt Form */}
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
           <AssistantTwoToneIcon />
          </Box>
          <Typography variant="h5">
            {editingId ? 'Edit Prompt' : 'Create Prompt'}
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
            label="Prompt Name"
            value={formData.prompt_name}
            onChange={(e) => handleFormChange('prompt_name', e.target.value)}
            disabled={submitting}
            fullWidth
            required
          />
          <TextField
            label="Prompt"
            value={formData.prompt}
            onChange={(e) => handleFormChange('prompt', e.target.value)}
            disabled={submitting}
            fullWidth
            required
            multiline
            minRows={3}
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
            select
            label="Chat Engine"
            value={formData.chat_engine}
            onChange={(e) => handleFormChange('chat_engine', e.target.value)}
            disabled={submitting || enginesLoading}
            fullWidth
            helperText={enginesLoading ? 'Loading engines...' : 'Select a chat engine for this prompt'}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {chatEngines.map((engine) => (
              <MenuItem key={engine._id} value={engine._id}>
                {engine.engine_name}
              </MenuItem>
            ))}
          </TextField>

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
                'Update Prompt'
              ) : (
                'Create Prompt'
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

      {/* Manage Prompts Table */}
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
            Manage Prompts
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
                  Loading prompts...
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
                  Unable to load prompts.
                </Typography>
              </Box>
            ) : prompts.length === 0 ? (
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
                  No prompts found. Create one above to get started.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Prompt</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Chat Engine</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Created By</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {prompts.map((prompt) => (
                      <TableRow
                        key={prompt._id}
                        hover
                        sx={{
                          bgcolor:
                            editingId === prompt._id
                              ? 'rgba(0,188,212,0.08)'
                              : 'transparent',
                        }}
                      >
                        <TableCell>
                          <Chip
                            label={prompt.prompt_name}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            maxWidth: 220,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {prompt.prompt}
                        </TableCell>
                        <TableCell
                          sx={{
                            maxWidth: 180,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {prompt.description || '—'}
                        </TableCell>
                        <TableCell>
                          {prompt.chat_engine ? (
                            <Chip
                              label={prompt.chat_engine.engine_name}
                              size="small"
                              sx={{
                                bgcolor: prompt.chat_engine.active
                                  ? 'rgba(76,175,80,0.15)'
                                  : 'rgba(244,67,54,0.15)',
                                color: prompt.chat_engine.active ? '#4caf50' : '#f44336',
                                borderColor: prompt.chat_engine.active
                                  ? 'rgba(76,175,80,0.4)'
                                  : 'rgba(244,67,54,0.4)',
                              }}
                              variant="outlined"
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              —
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{prompt.created_by}</TableCell>
                        <TableCell>
                          {new Date(prompt.created_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(prompt)}
                            sx={{ color: '#00bcd4' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(prompt._id)}
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

export default AIPage;
