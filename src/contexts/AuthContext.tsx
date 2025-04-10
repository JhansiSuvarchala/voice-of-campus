
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('campusVoiceUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // In a real app, this would call your backend API
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock authentication - In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, check if it's an admin login
      if (email === 'admin@campus.edu' && password === 'admin123') {
        const adminUser: User = {
          id: 'admin-1',
          name: 'Admin User',
          email: 'admin@campus.edu',
          role: 'admin'
        };
        setUser(adminUser);
        localStorage.setItem('campusVoiceUser', JSON.stringify(adminUser));
        toast.success('Logged in as Administrator');
        return;
      }
      
      // Mock student login for demo
      if (email && password) {
        const studentUser: User = {
          id: 'student-1',
          name: email.split('@')[0].replace(/[.]/g, ' '),
          email,
          role: 'student'
        };
        setUser(studentUser);
        localStorage.setItem('campusVoiceUser', JSON.stringify(studentUser));
        toast.success('Logged in successfully');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('campusVoiceUser');
    setUser(null);
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
