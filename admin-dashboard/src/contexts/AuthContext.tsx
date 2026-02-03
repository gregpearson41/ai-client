import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthContextType, AuthState, LoginCredentials, User } from '../types/auth';
import {
  loginApi,
  saveToken,
  getToken,
  removeToken,
  isTokenExpired,
  getUserFromToken
} from '../services/authService';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  const initializeAuth = useCallback(async () => {
    const token = getToken();

    if (token && !isTokenExpired(token)) {
      try {
        const user = await getUserFromToken();
        if (user) {
          setState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          });
          return;
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    }

    // Token invalid or user fetch failed
    if (token) {
      removeToken();
    }
    setState({
      ...initialState,
      isLoading: false
    });
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const { token, user } = await loginApi(credentials);
      saveToken(token);
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      setState({
        ...initialState,
        isLoading: false
      });
      throw error;
    }
  };

  const logout = (): void => {
    removeToken();
    setState({
      ...initialState,
      isLoading: false
    });
  };

  const updateUser = (user: User): void => {
    setState(prev => ({
      ...prev,
      user
    }));
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
