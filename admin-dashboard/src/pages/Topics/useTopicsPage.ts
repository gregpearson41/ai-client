import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

interface Prompt {
  _id: string;
  prompt_name: string;
  description?: string;
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

export interface Topic {
  _id: string;
  topic_name: string;
  topic_label: string;
  description: string;
  active: boolean;
  created_by: string;
  created_date: string;
  prompt?: {
    _id: string;
    prompt_name: string;
    description?: string;
  } | null;
}

interface TopicListResponse {
  success: boolean;
  data: Topic[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface TopicResponse {
  success: boolean;
  data: Topic;
  message?: string;
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

export interface TopicFormData {
  topic_name: string;
  topic_label: string;
  description: string;
  active: boolean;
  prompt: string;
}

const useTopicsPage = () => {
  const { user } = useAuth();

  // Topic list state
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Prompts state
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [promptsLoading, setPromptsLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState<TopicFormData>({
    topic_name: '',
    topic_label: '',
    description: '',
    active: true,
    prompt: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Delete state
  const [deleteError, setDeleteError] = useState('');

  const fetchTopics = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<TopicListResponse>('/api/topics');
      setTopics(res.data);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPrompts = useCallback(async () => {
    try {
      setPromptsLoading(true);
      const res = await api.get<PromptListResponse>('/api/prompts?limit=100');
      setPrompts(res.data);
    } catch (error) {
      console.error('Failed to fetch prompts:', error);
    } finally {
      setPromptsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopics();
    fetchPrompts();
  }, [fetchTopics, fetchPrompts]);

  const handleFormChange = (field: keyof TopicFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({ topic_name: '', topic_label: '', description: '', active: true, prompt: '' });
    setEditingId(null);
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleSubmit = async () => {
    if (!formData.topic_name.trim()) {
      setSubmitError('Topic name is required.');
      return;
    }
    if (/\s/.test(formData.topic_name)) {
      setSubmitError('Topic name must not contain spaces.');
      return;
    }
    if (!formData.topic_label.trim()) {
      setSubmitError('Topic label is required.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const payload = {
        topic_name: formData.topic_name,
        topic_label: formData.topic_label,
        description: formData.description,
        active: formData.active,
        created_by: user?.email || '',
        prompt: formData.prompt || null,
      };

      if (editingId) {
        await api.put<TopicResponse>(`/api/topics/${editingId}`, payload);
        setSubmitSuccess('Topic updated successfully.');
      } else {
        await api.post<TopicResponse>('/api/topics', payload);
        setSubmitSuccess('Topic created successfully.');
      }
      resetForm();
      await fetchTopics();
    } catch {
      setSubmitError(editingId ? 'Failed to update topic.' : 'Failed to create topic.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (topic: Topic) => {
    setFormData({
      topic_name: topic.topic_name,
      topic_label: topic.topic_label || '',
      description: topic.description || '',
      active: topic.active,
      prompt: topic.prompt?._id || '',
    });
    setEditingId(topic._id);
    setSubmitError('');
    setSubmitSuccess('');
    setDeleteError('');
  };

  const handleDelete = async (id: string) => {
    setDeleteError('');
    try {
      await api.delete<DeleteResponse>(`/api/topics/${id}`);
      await fetchTopics();
    } catch {
      setDeleteError('Failed to delete topic.');
    }
  };

  const handleToggleActive = async (topic: Topic) => {
    try {
      await api.patch<TopicResponse>(`/api/topics/${topic._id}/status`, {
        active: !topic.active,
      });
      await fetchTopics();
    } catch {
      setDeleteError('Failed to update topic status.');
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  return {
    user,
    topics,
    loading,
    error,
    prompts,
    promptsLoading,
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
  };
};

export default useTopicsPage;
