import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

export interface ChatEngine {
  _id: string;
  engine_name: string;
  description: string;
  api_key: string;
  chat_apiUrl: string;
  active: boolean;
  creation_date: string;
}

interface ChatEngineListResponse {
  success: boolean;
  data: ChatEngine[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface ChatEngineResponse {
  success: boolean;
  data: ChatEngine;
  message?: string;
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

export interface ChatEngineFormData {
  engine_name: string;
  description: string;
  api_key: string;
  chat_apiUrl: string;
  active: boolean;
}

const useChatEnginePage = () => {
  // List state
  const [engines, setEngines] = useState<ChatEngine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Form state
  const [formData, setFormData] = useState<ChatEngineFormData>({
    engine_name: '',
    description: '',
    api_key: '',
    chat_apiUrl: '',
    active: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Delete state
  const [deleteError, setDeleteError] = useState('');

  const fetchEngines = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<ChatEngineListResponse>('/api/chat-engines');
      setEngines(res.data);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEngines();
  }, [fetchEngines]);

  const handleFormChange = (field: keyof ChatEngineFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({ engine_name: '', description: '', api_key: '', chat_apiUrl: '', active: true });
    setEditingId(null);
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleSubmit = async () => {
    if (!formData.engine_name.trim() || !formData.api_key.trim()) {
      setSubmitError('Engine name and API key are required.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      if (editingId) {
        await api.put<ChatEngineResponse>(`/api/chat-engines/${editingId}`, formData);
        setSubmitSuccess('Chat engine updated successfully.');
      } else {
        await api.post<ChatEngineResponse>('/api/chat-engines', formData);
        setSubmitSuccess('Chat engine created successfully.');
      }
      resetForm();
      await fetchEngines();
    } catch {
      setSubmitError(editingId ? 'Failed to update chat engine.' : 'Failed to create chat engine.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (engine: ChatEngine) => {
    setFormData({
      engine_name: engine.engine_name,
      description: engine.description || '',
      api_key: engine.api_key,
      chat_apiUrl: engine.chat_apiUrl || '',
      active: engine.active,
    });
    setEditingId(engine._id);
    setSubmitError('');
    setSubmitSuccess('');
    setDeleteError('');
  };

  const handleDelete = async (id: string) => {
    setDeleteError('');
    try {
      await api.delete<DeleteResponse>(`/api/chat-engines/${id}`);
      await fetchEngines();
    } catch {
      setDeleteError('Failed to delete chat engine.');
    }
  };

  const handleToggleStatus = async (id: string) => {
    setDeleteError('');
    try {
      await api.patch<ChatEngineResponse>(`/api/chat-engines/${id}/status`, {});
      await fetchEngines();
    } catch {
      setDeleteError('Failed to toggle chat engine status.');
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  return {
    engines,
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
    handleToggleStatus,
    handleCancelEdit,
  };
};

export default useChatEnginePage;
