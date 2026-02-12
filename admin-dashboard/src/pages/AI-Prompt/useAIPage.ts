import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export interface ChatEngineRef {
  _id: string;
  engine_name: string;
  active: boolean;
}

export interface Prompt {
  _id: string;
  prompt_name: string;
  prompt: string;
  description: string;
  created_by: string;
  chat_engine: ChatEngineRef | null;
  created_date: string;
}

export interface ChatEngineOption {
  _id: string;
  engine_name: string;
  active: boolean;
}

interface PromptListResponse {
  success: boolean;
  data: Prompt[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface ChatEngineListResponse {
  success: boolean;
  data: ChatEngineOption[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface PromptResponse {
  success: boolean;
  data: Prompt;
  message?: string;
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

export interface PromptFormData {
  prompt_name: string;
  prompt: string;
  description: string;
  chat_engine: string;
}

const useAIPage = () => {
  const { user } = useAuth();

  // Prompt list state
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Chat engine options for dropdown
  const [chatEngines, setChatEngines] = useState<ChatEngineOption[]>([]);
  const [enginesLoading, setEnginesLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState<PromptFormData>({
    prompt_name: '',
    prompt: '',
    description: '',
    chat_engine: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Delete state
  const [deleteError, setDeleteError] = useState('');

  const fetchPrompts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<PromptListResponse>('/api/prompts');
      setPrompts(res.data);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChatEngines = useCallback(async () => {
    try {
      setEnginesLoading(true);
      const res = await api.get<ChatEngineListResponse>('/api/chat-engines?limit=100&active=true');
      setChatEngines(res.data);
    } catch {
      // Silently fail – dropdown will just be empty
    } finally {
      setEnginesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrompts();
    fetchChatEngines();
  }, [fetchPrompts, fetchChatEngines]);

  const handleFormChange = (field: keyof PromptFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({ prompt_name: '', prompt: '', description: '', chat_engine: '' });
    setEditingId(null);
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleSubmit = async () => {
    if (!formData.prompt_name.trim() || !formData.prompt.trim()) {
      setSubmitError('Prompt name and prompt are required.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const payload = {
        prompt_name: formData.prompt_name,
        prompt: formData.prompt,
        description: formData.description,
        created_by: user?.email || '',
        chat_engine: formData.chat_engine || null,
      };

      if (editingId) {
        await api.put<PromptResponse>(`/api/prompts/${editingId}`, payload);
        setSubmitSuccess('Prompt updated successfully.');
      } else {
        await api.post<PromptResponse>('/api/prompts', payload);
        setSubmitSuccess('Prompt created successfully.');
      }
      resetForm();
      await fetchPrompts();
    } catch {
      setSubmitError(editingId ? 'Failed to update prompt.' : 'Failed to create prompt.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (prompt: Prompt) => {
    setFormData({
      prompt_name: prompt.prompt_name,
      prompt: prompt.prompt,
      description: prompt.description || '',
      chat_engine: prompt.chat_engine?._id || '',
    });
    setEditingId(prompt._id);
    setSubmitError('');
    setSubmitSuccess('');
    setDeleteError('');
  };

  const handleDelete = async (id: string) => {
    setDeleteError('');
    try {
      await api.delete<DeleteResponse>(`/api/prompts/${id}`);
      await fetchPrompts();
    } catch {
      setDeleteError('Failed to delete prompt.');
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  return {
    user,
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
  };
};

export default useAIPage;
