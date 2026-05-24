/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: 'researcher' | 'policy_maker' | 'admin' | 'public';
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  loginWithGoogle: (name: string, email: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isLoading: boolean;
  isResearcher: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth
    const storedUser = localStorage.getItem('neural-ocean-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('neural-ocean-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    try {
      // Mock authentication with validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        role: role as User['role'],
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
      };
      
      setUser(mockUser);
      localStorage.setItem('neural-ocean-user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const loginWithGoogle = async (name: string, email: string): Promise<boolean> => {
    try {
      // Format name to not show raw handle
      let formattedName = name;
      if (name.toLowerCase().includes('jasolaaksh')) {
        formattedName = 'Aksh Dangi';
      }

      // Create user from Google auth data
      const googleUser: User = {
        id: Date.now().toString(),
        email: email,
        role: 'researcher',
        name: formattedName
      };
      
      setUser(googleUser);
      localStorage.setItem('neural-ocean-user', JSON.stringify(googleUser));
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('neural-ocean-user');
  };

  const isResearcher = (): boolean => {
    if (!user) return false;
    return ['researcher', 'policy_maker', 'admin'].includes(user.role);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('neural-ocean-user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, updateUser, isLoading, isResearcher }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};