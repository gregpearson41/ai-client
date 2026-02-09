import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  Paper,
} from '@mui/material';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import useToolsPage_two from './useToolsPage_two';

const ToolsPage_two: React.FC = () => {
  const {
    topics,
    topicsLoading,
    topicsError,
    prompts,
    promptsLoading,
    promptsError,
    chatEngines,
    chatEnginesLoading,
    chatEnginesError,
    formData,
    submitting,
    submitError,
    submitSuccess,
    aiResponse,
    handleFormChange,
    handleSubmit,
  } = useToolsPage_two();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
        Ask a Question
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Select a topic and submit your question to get help from the AI client.
      </Typography>

      <Card>
        <CardContent sx={{ p: 3 }}>
          {/* Widget header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 10,
                bgcolor: 'rgba(0,188,212,0.1)',
                border: '1px solid rgba(0,188,212,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <QuestionAnswerIcon sx={{ color: '#00bcd4', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Submit a Question
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Choose a topic and ask your question below
              </Typography>
            </Box>
          </Box>

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
              select
              label="Topic"
              value={formData.topic}
              onChange={(e) => handleFormChange('topic', e.target.value)}
              disabled={submitting || topicsLoading}
              fullWidth
              required
              helperText={
                topicsLoading
                  ? 'Loading topics...'
                  : topicsError
                  ? 'Unable to load topics. Please try refreshing.'
                  : 'Select a topic for your question'
              }
              error={topicsError}
            >
              <MenuItem value="">
                <em>Select a topic</em>
              </MenuItem>
              {topics.map((topic) => (
                <MenuItem key={topic._id} value={topic._id}>
                  {topic.topic_label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Prompt"
              value={formData.prompt}
              onChange={(e) => handleFormChange('prompt', e.target.value)}
              disabled={submitting || promptsLoading}
              fullWidth
              helperText={
                promptsLoading
                  ? 'Loading prompts...'
                  : promptsError
                  ? 'Unable to load prompts. Please try refreshing.'
                  : 'Select a prompt to use (optional)'
              }
              error={promptsError}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {prompts.map((prompt) => (
                <MenuItem key={prompt._id} value={prompt._id}>
                  {prompt.prompt_name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Chat Engine"
              value={formData.chat_engine}
              onChange={(e) => handleFormChange('chat_engine', e.target.value)}
              disabled={submitting || chatEnginesLoading}
              fullWidth
              required
              helperText={
                chatEnginesLoading
                  ? 'Loading chat engines...'
                  : chatEnginesError
                  ? 'Unable to load chat engines. Please try refreshing.'
                  : 'Select a chat engine to process your question'
              }
              error={chatEnginesError}
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

            <TextField
              label="Your Question"
              value={formData.question}
              onChange={(e) => handleFormChange('question', e.target.value)}
              disabled={submitting}
              fullWidth
              required
              multiline
              minRows={4}
              placeholder="Type your question here..."
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
                ) : (
                  'Submit Question'
                )}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* AI Response */}
      {submitting && (
        <Card sx={{ mt: 3 }}>
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <CircularProgress size={32} sx={{ color: '#00bcd4', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              Waiting for AI response...
            </Typography>
          </CardContent>
        </Card>
      )}

      {aiResponse && !submitting && (
        <Card sx={{ mt: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  bgcolor: 'rgba(76,175,80,0.1)',
                  border: '1px solid rgba(76,175,80,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SmartToyIcon sx={{ color: '#4caf50', fontSize: 22 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  AI Response
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                  <Chip label={aiResponse.engine} size="small" color="primary" variant="outlined" />
                  {aiResponse.topic && (
                    <Chip label={aiResponse.topic.topic_label} size="small" variant="outlined" />
                  )}
                  {aiResponse.prompt && (
                    <Chip label={aiResponse.prompt.prompt_name} size="small" variant="outlined" />
                  )}
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                bgcolor: 'rgba(0,0,0,0.02)',
                borderColor: 'divider',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                lineHeight: 1.7,
                fontSize: '0.95rem',
              }}
            >
              <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
                {aiResponse.response}
              </Typography>
            </Paper>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ToolsPage_two;
