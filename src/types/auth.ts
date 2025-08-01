export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'central_admin' | 'state_admin' | 'central_user' | 'state_user';
  state?: string; // Only for state users/admins
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  createdBy: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'central_admin' | 'state_admin' | 'central_user' | 'state_user';
  state?: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}