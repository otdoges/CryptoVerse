
import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthState, User } from '@/types';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser, loginWithEmail, registerWithEmail, logout as supabaseLogout } from "@/services/supabaseService";

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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          try {
            const user = await getCurrentUser();
            setAuthState({
              user,
              isAuthenticated: !!user,
              isLoading: false,
            });
          } catch (error) {
            console.error('Failed to get user profile:', error);
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
      }
    );

    // THEN check for existing session
    const checkSession = async () => {
      try {
        const user = await getCurrentUser();
        setAuthState({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to get current session:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      await loginWithEmail(email, password);
      toast.success("Successfully logged in!");
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Failed to login. Please check your credentials.");
      throw error;
    }
  };

  const register = async (email: string, username: string, password: string): Promise<void> => {
    try {
      await registerWithEmail(email, password, username);
      toast.success("Account created successfully! Please verify your email.");
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Failed to create account. Please try again.");
      throw error;
    }
  };

  const logout = (): void => {
    supabaseLogout().then(() => {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      toast.info("You've been logged out");
    }).catch(error => {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    });
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
