
import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthState, User } from '@/types';
import { toast } from "sonner";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check if user is logged in from local storage
    const storedUser = localStorage.getItem('dfi_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAuthState({
          user: parsedUser,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('dfi_user');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real app, this would validate credentials against your backend
      // For demo purposes, we'll create a mock user
      const mockUser: User = {
        id: '1',
        email: email,
        username: email.split('@')[0],
      };
      
      localStorage.setItem('dfi_user', JSON.stringify(mockUser));
      
      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });
      
      toast.success("Successfully logged in!");
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Failed to login. Please check your credentials.");
      throw error;
    }
  };

  const register = async (email: string, username: string, password: string): Promise<void> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // In a real app, this would register a new user in your backend
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        username,
      };
      
      localStorage.setItem('dfi_user', JSON.stringify(mockUser));
      
      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });
      
      toast.success("Account created successfully!");
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Failed to create account. Please try again.");
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('dfi_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    toast.info("You've been logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
      }}
    >
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
