import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState, LoginCredentials, CreateUserData, ResetPasswordData, ChangePasswordData } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  createUser: (userData: CreateUserData) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  canViewState: (state: string) => boolean;
  canCreateUser: (role: string) => boolean;
  getAllowedStates: () => string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false, error: null };
    case 'LOGIN_FAILURE':
      return { ...state, user: null, isAuthenticated: false, isLoading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, isLoading: false, error: null };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    username: 'central_admin',
    email: 'admin@central.gov.in',
    firstName: 'Central',
    lastName: 'Admin',
    role: 'central_admin',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-01-15T10:30:00Z',
    createdBy: 'system'
  },
  {
    id: '2',
    username: 'mh_admin',
    email: 'admin@maharashtra.gov.in',
    firstName: 'Maharashtra',
    lastName: 'Admin',
    role: 'state_admin',
    state: 'Maharashtra',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-01-15T09:15:00Z',
    createdBy: '1'
  },
  {
    id: '3',
    username: 'up_admin',
    email: 'admin@up.gov.in',
    firstName: 'Uttar Pradesh',
    lastName: 'Admin',
    role: 'state_admin',
    state: 'Uttar Pradesh',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-01-15T08:45:00Z',
    createdBy: '1'
  },
  {
    id: '4',
    username: 'central_user1',
    email: 'user1@central.gov.in',
    firstName: 'Central',
    lastName: 'User',
    role: 'central_user',
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    lastLogin: '2024-01-15T11:20:00Z',
    createdBy: '1'
  },
  {
    id: '5',
    username: 'mh_user1',
    email: 'user1@maharashtra.gov.in',
    firstName: 'Maharashtra',
    lastName: 'User',
    role: 'state_user',
    state: 'Maharashtra',
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    lastLogin: '2024-01-15T10:00:00Z',
    createdBy: '2'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  });

  useEffect(() => {
    // Check for stored authentication
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication logic
      const user = mockUsers.find(u => u.username === credentials.username && u.isActive);
      
      if (!user) {
        throw new Error('Invalid username or password');
      }
      
      // In real implementation, password would be verified here
      if (credentials.password !== 'password123') {
        throw new Error('Invalid username or password');
      }
      
      const updatedUser = { ...user, lastLogin: new Date().toISOString() };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch({ type: 'LOGIN_SUCCESS', payload: updatedUser });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: (error as Error).message });
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const createUser = async (userData: CreateUserData): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user creation logic
      const newUser: User = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        state: userData.state,
        isActive: true,
        createdAt: new Date().toISOString(),
        createdBy: state.user?.id || 'unknown'
      };
      
      mockUsers.push(newUser);
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  const resetPassword = async (data: ResetPasswordData): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock password reset logic
      const user = mockUsers.find(u => u.email === data.email);
      if (!user) {
        throw new Error('Email not found');
      }
      
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  const changePassword = async (data: ChangePasswordData): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (data.newPassword !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      // Mock password change logic
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  const canViewState = (stateToView: string): boolean => {
    if (!state.user) return false;
    
    // Central users can view all states
    if (state.user.role === 'central_admin' || state.user.role === 'central_user') {
      return true;
    }
    
    // State users can only view their own state
    return state.user.state === stateToView;
  };

  const canCreateUser = (roleToCreate: string): boolean => {
    if (!state.user) return false;
    
    switch (state.user.role) {
      case 'central_admin':
        return ['central_admin', 'central_user', 'state_admin'].includes(roleToCreate);
      case 'state_admin':
        return roleToCreate === 'state_user';
      default:
        return false;
    }
  };

  const getAllowedStates = (): string[] => {
    if (!state.user) return [];
    
    if (state.user.role === 'central_admin' || state.user.role === 'central_user') {
      return ['Maharashtra', 'Uttar Pradesh', 'Tamil Nadu', 'Karnataka', 'West Bengal', 'Gujarat'];
    }
    
    return state.user.state ? [state.user.state] : [];
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      createUser,
      resetPassword,
      changePassword,
      canViewState,
      canCreateUser,
      getAllowedStates
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};