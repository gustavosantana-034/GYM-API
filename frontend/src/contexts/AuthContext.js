import React, { createContext, useContext, useState, useEffect } from 'react';
import avatarImage from '../assets/gugu.jpg';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const login = async (email, password) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const userData = {
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
      return { success: false, error: error.message };
    }
  };

  const signup = async (name, email, password) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const userData = {
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
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('fitness_token');
    localStorage.removeItem('fitness_user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('fitness_user', JSON.stringify(updatedUser));
  };

  const value = {
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