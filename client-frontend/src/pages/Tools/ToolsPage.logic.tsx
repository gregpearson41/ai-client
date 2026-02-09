import { useState, useMemo } from 'react';

export interface ToolsLogicState {
  inputText: string;
  outputText: string;
  copied: boolean;
  stats: {
    words: number;
    chars: number;
    charsNoSpaces: number;
    sentences: number;
    lines: number;
  };
  setInputText: (text: string) => void;
  setOutputText: (text: string) => void;
  handleTransform: (fn: (t: string) => string) => void;
  handleCopy: () => Promise<void>;
}

export const transforms = [
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

export const useToolsLogic = (): ToolsLogicState => {
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

  const handleTransform = (fn: (t: string) => string) => {
    setOutputText(fn(inputText));
  };

  const handleCopy = async () => {
    if (!outputText) return;
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return {
    inputText,
    outputText,
    copied,
    stats,
    setInputText,
    setOutputText,
    handleTransform,
    handleCopy,
  };
};
