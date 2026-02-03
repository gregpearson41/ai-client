export type UserRole = 'App Admin' | 'Owner' | 'Editor' | 'Viewer';

export interface User {
  _id: string;
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

export interface DecodedToken {
  id: string;
  exp: number;
  iat: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  token?: string;
  user?: T;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}
