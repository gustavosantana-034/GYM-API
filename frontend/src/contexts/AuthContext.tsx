import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AuthContextType, AuthResponse, User } from '../types';
import { apiService } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('fitness_token');
    const userData = localStorage.getItem('fitness_user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await apiService.login({ email, password });
      
      if (response.success && response.data) {
        const { token, refreshToken } = response.data;
        
        // Store tokens
        localStorage.setItem('fitness_token', token);
        if (refreshToken) {
          localStorage.setItem('fitness_refresh_token', refreshToken);
        }
        
        // Get user profile
        const profileResponse = await apiService.getProfile();
        if (profileResponse.success && profileResponse.data) {
          const userData: User = {
            id: profileResponse.data.id,
            name: profileResponse.data.name,
            email: profileResponse.data.email,
            avatar: undefined, // No default avatar
            membership: 'premium', // Default membership
            stats: {
              workoutsCompleted: 0,
              totalTime: 0,
              currentStreak: 0,
              weight: 70.0,
              bodyFat: 15.0
            }
          };
          
          localStorage.setItem('fitness_user', JSON.stringify(userData));
          setIsAuthenticated(true);
          setUser(userData);
        }
        
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await apiService.register({ name, email, password });
      
      if (response.success && response.data) {
        const { token, refreshToken } = response.data;
        
        // Store tokens
        localStorage.setItem('fitness_token', token);
        if (refreshToken) {
          localStorage.setItem('fitness_refresh_token', refreshToken);
        }
        
        // Get user profile
        const profileResponse = await apiService.getProfile();
        if (profileResponse.success && profileResponse.data) {
          const userData: User = {
            id: profileResponse.data.id,
            name: profileResponse.data.name,
            email: profileResponse.data.email,
            avatar: undefined, // No default avatar
            membership: 'basic', // New users start with basic membership
            stats: {
              workoutsCompleted: 0,
              totalTime: 0,
              currentStreak: 0,
              weight: 70.0,
              bodyFat: 15.0
            }
          };
          
          localStorage.setItem('fitness_user', JSON.stringify(userData));
          setIsAuthenticated(true);
          setUser(userData);
        }
        
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const logout = (): void => {
    localStorage.removeItem('fitness_token');
    localStorage.removeItem('fitness_refresh_token');
    localStorage.removeItem('fitness_user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (updates: Partial<User>): void => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('fitness_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    login,
    signup,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 