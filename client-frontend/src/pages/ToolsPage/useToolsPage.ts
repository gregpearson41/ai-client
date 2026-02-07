import { useState, useMemo } from 'react';

export interface Transform {
  label: string;
  fn: (t: string) => string;
}

export interface StatChip {
  label: string;
  color: string;
}

const useToolsPage = () => {
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

  const transforms: Transform[] = [
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

  const statChips: StatChip[] = [
    { label: `${stats.words} words`,            color: '#00bcd4' },
    { label: `${stats.chars} chars`,            color: '#9c27b0' },
    { label: `${stats.charsNoSpaces} no-space`, color: '#ff9800' },
    { label: `${stats.sentences} sentences`,    color: '#4caf50' },
    { label: `${stats.lines} lines`,            color: '#2196f3' },
  ];

  return {
    inputText,
    setInputText,
    outputText,
    copied,
    transforms,
    handleTransform,
    handleCopy,
    statChips,
  };
};

export default useToolsPage;
