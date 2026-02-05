import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import CheckIcon from '@mui/icons-material/Check';
import BuildIcon from '@mui/icons-material/Build';

const ToolsPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const words = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
    const chars = inputText.length;
    const charsNoSpaces = inputText.replace(/\s/g, '').length;
    const sentences = inputText.trim()
      ? inputText.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
      : 0;
    const lines = inputText.trim() ? inputText.split('\n').length : 0;
    return { words, chars, charsNoSpaces, sentences, lines };
  }, [inputText]);

  const transforms = [
    { label: 'UPPERCASE',            fn: (t: string) => t.toUpperCase() },
    { label: 'lowercase',            fn: (t: string) => t.toLowerCase() },
    { label: 'Title Case',           fn: (t: string) => t.replace(/\b\w/g, (c) => c.toUpperCase()) },
    { label: 'Reverse',              fn: (t: string) => t.split('').reverse().join('') },
    { label: 'Remove Extra Spaces',  fn: (t: string) => t.replace(/\s+/g, ' ').trim() },
    {
      label: 'Capitalize Sentences',
      fn: (t: string) => t.replace(/(^|[.!?]\s+)(\w)/g, (_match, sep, c) => sep + c.toUpperCase()),
    },
  ];

  const handleTransform = (fn: (t: string) => string) => {
    setOutputText(fn(inputText));
  };

  const handleCopy = async () => {
    if (!outputText) return;
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statChips = [
    { label: `${stats.words} words`,            color: '#00bcd4' },
    { label: `${stats.chars} chars`,            color: '#9c27b0' },
    { label: `${stats.charsNoSpaces} no-space`, color: '#ff9800' },
    { label: `${stats.sentences} sentences`,    color: '#4caf50' },
    { label: `${stats.lines} lines`,            color: '#2196f3' },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
        Simple AI App
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
       This is where you put your quick blurb about this particular area
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
              <BuildIcon sx={{ color: '#00bcd4', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Text Utilities
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Transform, analyse, and copy text instantly
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Input column */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Input Text"
                multiline
                rows={8}
                fullWidth
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste or type your text here…"
                variant="outlined"
              />

              {/* Live stats chips */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {statChips.map((s) => (
                  <Chip
                    key={s.label}
                    label={s.label}
                    size="small"
                    sx={{
                      bgcolor: `${s.color}10`,
                      color: s.color,
                      fontWeight: 600,
                      border: `1px solid ${s.color}28`,
                    }}
                  />
                ))}
              </Box>
            </Grid>

            {/* Output column */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Output
                </Typography>
                <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
                  <span>
                    <IconButton
                      size="small"
                      onClick={handleCopy}
                      disabled={!outputText}
                      sx={{ color: '#00bcd4' }}
                    >
                      {copied ? <CheckIcon fontSize="small" /> : <CopyAllIcon fontSize="small" />}
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>

              <TextField
                multiline
                rows={8}
                fullWidth
                value={outputText}
                placeholder="Transformed text will appear here…"
                variant="outlined"
                slotProps={{ input: { readOnly: true } }}
                sx={{ '& .MuiInputBase-input': { color: '#0097a7' } }}
              />

              {/* Transform buttons */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {transforms.map((t) => (
                  <Button
                    key={t.label}
                    variant="outlined"
                    size="small"
                    onClick={() => handleTransform(t.fn)}
                    disabled={!inputText}
                  >
                    {t.label}
                  </Button>
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ToolsPage;
