import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export interface Topic {
  _id: string;
  topic_name: string;
  description: string;
  active: boolean;
  created_by: string;
  created_date: string;
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
  description: string;
  active: boolean;
}

const useTopicsPage = () => {
  const { user } = useAuth();

  // Topic list state
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Form state
  const [formData, setFormData] = useState<TopicFormData>({
    topic_name: '',
    description: '',
    active: true,
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

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const handleFormChange = (field: keyof TopicFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({ topic_name: '', description: '', active: true });
    setEditingId(null);
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleSubmit = async () => {
    if (!formData.topic_name.trim()) {
      setSubmitError('Topic name is required.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const payload = {
        topic_name: formData.topic_name,
        description: formData.description,
        active: formData.active,
        created_by: user?.email || '',
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
      description: topic.description || '',
      active: topic.active,
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
