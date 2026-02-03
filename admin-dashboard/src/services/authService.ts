import { LoginCredentials, User, DecodedToken, ApiResponse } from '../types/auth';
import { jwtDecode } from 'jwt-decode';
import api from './api';

const TOKEN_KEY = 'auth_token';

/**
 * Login user with email and password
 */
export const loginApi = async (credentials: LoginCredentials): Promise<{ token: string; user: User }> => {
  const response = await api.post<ApiResponse<User>>('/api/auth/login', credentials);

  if (!response.success || !response.token || !response.user) {
    throw new Error(response.message || 'Login failed');
  }

  // Normalize user object (add id from _id for compatibility)
  const user: User = {
    ...response.user,
    id: response.user._id || response.user.id,
  };

  return { token: response.token, user };
};

/**
 * Get current user profile
 */
export const getMeApi = async (): Promise<User> => {
  const response = await api.get<ApiResponse<User>>('/api/auth/me');

  if (!response.success || !response.user) {
    throw new Error(response.message || 'Failed to get user profile');
  }

  return {
    ...response.user,
    id: response.user._id || response.user.id,
  };
};

/**
 * Update user profile
 */
export const updateProfileApi = async (data: { name?: string; email?: string }): Promise<User> => {
  const response = await api.put<ApiResponse<User>>('/api/auth/profile', data);

  if (!response.success || !response.user) {
    throw new Error(response.message || 'Failed to update profile');
  }

  return {
    ...response.user,
    id: response.user._id || response.user.id,
  };
};

/**
 * Update password
 */
export const updatePasswordApi = async (data: { currentPassword: string; newPassword: string }): Promise<string> => {
  const response = await api.put<ApiResponse<User> & { token?: string }>('/api/auth/password', data);

  if (!response.success || !response.token) {
    throw new Error(response.message || 'Failed to update password');
  }

  return response.token;
};

/**
 * Save token to localStorage
 */
export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Get token from localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove token from localStorage
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Decode JWT token
 */
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  return decoded.exp * 1000 < Date.now();
};

/**
 * Get user from token (fetches from API for accurate data)
 */
export const getUserFromToken = async (): Promise<User | null> => {
  try {
    const user = await getMeApi();
    return user;
  } catch {
    return null;
  }
};
