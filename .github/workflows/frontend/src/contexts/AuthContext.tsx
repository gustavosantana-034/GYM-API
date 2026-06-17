import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import avatarImage from '../assets/profile.jpg';
import { AuthContextType, AuthResponse, User } from '../types';

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const userData: User = {
        id: '1',
        name: 'Gustavo Santana',
        email: email,
        avatar: avatarImage,
        membership: 'premium',
        stats: {
          workoutsCompleted: 127,
          totalTime: 89.5,
          currentStreak: 12,
          weight: 75.2,
          bodyFat: 12.5
        }
      };

      const token = 'mock_jwt_token_' + Date.now();
      
      localStorage.setItem('fitness_token', token);
      localStorage.setItem('fitness_user', JSON.stringify(userData));
      
      setIsAuthenticated(true);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const userData: User = {
        id: '1',
        name: name,
        email: email,
        avatar: avatarImage,
        membership: 'basic',
        stats: {
          workoutsCompleted: 0,
          totalTime: 0,
          currentStreak: 0,
          weight: 70.0,
          bodyFat: 15.0
        }
      };

      const token = 'mock_jwt_token_' + Date.now();
      
      localStorage.setItem('fitness_token', token);
      localStorage.setItem('fitness_user', JSON.stringify(userData));
      
      setIsAuthenticated(true);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const logout = (): void => {
    localStorage.removeItem('fitness_token');
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