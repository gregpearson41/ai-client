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

interface TopicListResponse {
  success: boolean;
  data: Topic[];
}

interface PromptListResponse {
  success: boolean;
  data: Prompt[];
}

export interface QuestionFormData {
  question: string;
  topic: string;
  prompt: string;
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

  // Form state
  const [formData, setFormData] = useState<QuestionFormData>({
    question: '',
    topic: '',
    prompt: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

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

  useEffect(() => {
    fetchTopics();
    fetchPrompts();
  }, [fetchTopics, fetchPrompts]);

  const handleFormChange = (field: keyof QuestionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear messages when user starts typing
    if (submitError) setSubmitError('');
    if (submitSuccess) setSubmitSuccess('');
  };

  const resetForm = () => {
    setFormData({ question: '', topic: '', prompt: '' });
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleSubmit = async () => {
    if (!formData.question.trim()) {
      setSubmitError('Please enter a question.');
      return;
    }
    if (!formData.topic) {
      setSubmitError('Please select a topic.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const selectedTopic = topics.find((t) => t._id === formData.topic);
      const selectedPrompt = prompts.find((p) => p._id === formData.prompt);
      const payload = {
        question: formData.question,
        topic_id: formData.topic,
        topic_name: selectedTopic?.topic_name || '',
        prompt_id: formData.prompt || null,
        prompt_name: selectedPrompt?.prompt_name || '',
      };

      const res = await fetch(`${API_BASE_URL}/api/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to submit question');

      setSubmitSuccess('Your question has been submitted successfully!');
      resetForm();
    } catch {
      setSubmitError('Failed to submit your question. Please try again.');
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
    formData,
    submitting,
    submitError,
    submitSuccess,
    handleFormChange,
    handleSubmit,
    resetForm,
  };
};

export default useToolsPage_two;
