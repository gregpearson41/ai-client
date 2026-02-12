const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export interface SystemInfoResponse {
  success: boolean;
  data: {
    companyOwner: string;
    version: string;
    buildNumber: string;
  };
}


interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
}

class ApiError extends Error {
  status: number;
  errors?: Array<{ field: string; message: string }>;

  constructor(message: string, status: number, errors?: Array<{ field: string; message: string }>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const apiRequest = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const { method = 'GET', headers = {}, body } = options;

  const token = getAuthToken();

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.message || 'An error occurred',
      response.status,
      data.errors
    );
  }

  return data;
};



export const api = {
  async systemInfo(): Promise<SystemInfoResponse> {
    const res = await fetch(`${API_BASE_URL}/api/system-info`);
    if (!res.ok) throw new Error('Failed to fetch system info');
    return res.json();
  },
  get: <T>(endpoint: string, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: 'GET', headers }),

  post: <T>(endpoint: string, body: unknown, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: 'POST', body, headers }),

  put: <T>(endpoint: string, body: unknown, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: 'PUT', body, headers }),

  patch: <T>(endpoint: string, body: unknown, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: 'PATCH', body, headers }),

  delete: <T>(endpoint: string, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: 'DELETE', headers }),
};

export { ApiError };
export default api;
