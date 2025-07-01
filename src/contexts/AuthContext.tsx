'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: number;
  email: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>; // login
  signUp: (email: string, password: string) => Promise<{ error: any }>; // register
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  signInWithProvider: (provider: 'google' | 'apple') => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:8080/wp-json/simple-jwt-login/v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user/token from localStorage
    const storedToken = localStorage.getItem('jwt_token');
    const storedUser = localStorage.getItem('jwt_user');
    if (storedToken && storedUser && storedUser !== 'undefined') {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.data && data.data.jwt) {
        setToken(data.data.jwt);
        setUser(data.data.user);
        localStorage.setItem('jwt_token', data.data.jwt);
        localStorage.setItem('jwt_user', JSON.stringify(data.data.user));
        setLoading(false);
        return { error: null };
      } else {
        setLoading(false);
        return { error: data.data?.message || 'Login failed' };
      }
    } catch (error) {
      setLoading(false);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simple JWT Login does not provide registration, so use WP REST API
      const res = await fetch('http://localhost:8080/wp-json/wp/v2/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username: email, password })
      });
      const data = await res.json();
      if (data && !data.code) {
        setLoading(false);
        // Optionally, auto-login after registration
        return await signIn(email, password);
      } else {
        setLoading(false);
        return { error: data.message || 'Registration failed' };
      }
    } catch (error) {
      setLoading(false);
      return { error };
    }
  };

  const signOut = async () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('jwt_user');
  };

  const resetPassword = async (email: string) => {
    // Use WP REST API or plugin endpoint for password reset
    try {
      const res = await fetch('http://localhost:8080/wp-json/simple-jwt-login/v1/password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        return { error: null };
      } else {
        return { error: data.data?.message || 'Reset failed' };
      }
    } catch (error) {
      return { error };
    }
  };

  const signInWithProvider = async (provider: 'google' | 'apple') => {
    // Social login: open provider URL in a new window and handle callback
    try {
      window.location.href = `${API_URL}/auth?provider=${provider}&redirect_to=${window.location.origin}/auth/callback`;
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    token,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInWithProvider,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 