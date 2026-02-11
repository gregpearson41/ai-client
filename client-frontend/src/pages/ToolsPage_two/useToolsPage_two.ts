import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050';
const ADMIN_API_URL = process.env.REACT_APP_ADMIN_API_URL || 'http://localhost:5050';

export interface Topic {
  _id: string;
  topic_name: string;
  topic_label: string;
  description: string;
}

export interface Prompt {
  _id: string;
  prompt_name: string;
  description: string;
}

export interface ChatEngine {
  _id: string;
  engine_name: string;
  description: string;
  chat_apiUrl: string;
}

interface TopicListResponse {
  success: boolean;
  data: Topic[];
}

interface PromptListResponse {
  success: boolean;
  data: Prompt[];
}

interface ChatEngineListResponse {
  success: boolean;
  data: ChatEngine[];
}

export interface QuestionFormData {
  question: string;
  topic: string;
  prompt: string;
  chat_engine: string;
}

export interface ChatResponse {
  response: string;
  engine: string;
  topic: { topic_name: string; topic_label: string } | null;
  prompt: { prompt_name: string } | null;
}

interface ChatPromptApiResponse {
  success: boolean;
  data: ChatResponse;
  message?: string;
}

const useToolsPage_two = () => {
  // Topics state
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [topicsError, setTopicsError] = useState(false);

  // Prompts state
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [promptsLoading, setPromptsLoading] = useState(true);
  const [promptsError, setPromptsError] = useState(false);

  // Chat engines state
  const [chatEngines, setChatEngines] = useState<ChatEngine[]>([]);
  const [chatEnginesLoading, setChatEnginesLoading] = useState(true);
  const [chatEnginesError, setChatEnginesError] = useState(false);

  // Form state
  const [formData, setFormData] = useState<QuestionFormData>({
    question: '',
    topic: '',
    prompt: '',
    chat_engine: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // AI response state
  const [aiResponse, setAiResponse] = useState<ChatResponse | null>(null);

  const fetchTopics = useCallback(async () => {
    try {
      setTopicsLoading(true);
      const res = await fetch(`${ADMIN_API_URL}/api/public/topics`);
      if (!res.ok) throw new Error('Failed to fetch topics');
      const data: TopicListResponse = await res.json();
      setTopics(data.data);
      setTopicsError(false);
    } catch {
      setTopicsError(true);
    } finally {
      setTopicsLoading(false);
    }
  }, []);

  const fetchPrompts = useCallback(async () => {
    try {
      setPromptsLoading(true);
      const res = await fetch(`${ADMIN_API_URL}/api/public/prompts`);
      if (!res.ok) throw new Error('Failed to fetch prompts');
      const data: PromptListResponse = await res.json();
      setPrompts(data.data);
      setPromptsError(false);
    } catch {
      setPromptsError(true);
    } finally {
      setPromptsLoading(false);
    }
  }, []);

  const fetchChatEngines = useCallback(async () => {
    try {
      setChatEnginesLoading(true);
      const res = await fetch(`${ADMIN_API_URL}/api/public/chat-engines`);
      if (!res.ok) throw new Error('Failed to fetch chat engines');
      const data: ChatEngineListResponse = await res.json();
      setChatEngines(data.data);
      setChatEnginesError(false);
    } catch {
      setChatEnginesError(true);
    } finally {
      setChatEnginesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopics();
    fetchPrompts();
    fetchChatEngines();
  }, [fetchTopics, fetchPrompts, fetchChatEngines]);

  const handleFormChange = (field: keyof QuestionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear messages when user starts typing
    if (submitError) setSubmitError('');
    if (submitSuccess) setSubmitSuccess('');
  };

  const resetForm = () => {
    setFormData({ question: '', topic: '', prompt: '', chat_engine: '' });
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleSubmit = async () => {
    if (!formData.question.trim()) {
      setSubmitError('Please enter a question.');
      return;
    }
    if (!formData.chat_engine) {
      setSubmitError('Please select a chat engine.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');
    setAiResponse(null);

    try {
      const payload = {
        question: formData.question,
        topic_id: formData.topic || null,
        prompt_id: formData.prompt || null,
        chat_engine_id: formData.chat_engine,
      };

      const res = await fetch(`${ADMIN_API_URL}/api/public/chat-prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data: ChatPromptApiResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to get a response');
      }

      setAiResponse(data.data);
      setSubmitSuccess(`Response received from ${data.data.engine}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit your question. Please try again.';
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return {
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
    resetForm,
  };
};

export default useToolsPage_two;
