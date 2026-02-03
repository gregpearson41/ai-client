const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050';

export interface HealthResponse {
  status: string;
  timestamp: string;
  service: string;
}

export interface RootResponse {
  message: string;
  version: string;
  documentation: string;
}

export const api = {
  async health(): Promise<HealthResponse> {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },

  async root(): Promise<RootResponse> {
    const res = await fetch(`${API_BASE_URL}/`);
    if (!res.ok) throw new Error('Failed to fetch API info');
    return res.json();
  },
};

export default api;
