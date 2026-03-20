'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'super-admin';
  isEmailVerified?: boolean;
  isActive?: boolean;
  lastLogin?: Date;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  hasRole: (roles: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const scheduleTokenRefresh = useCallback((expiresIn: number = 14 * 60 * 1000) => {
    clearRefreshTimer();
    const refreshTime = Math.max(expiresIn - 60 * 1000, 60 * 1000);
    refreshTimerRef.current = setTimeout(async () => {
      if (!isRefreshingRef.current) {
        await refreshToken();
      }
    }, refreshTime);
  }, [clearRefreshTimer]);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (isRefreshingRef.current) {
      return false;
    }

    isRefreshingRef.current = true;

    try {
      const response = await fetch(`${API_URL}/api/auth/v2/refresh`, {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        setUser(null);
        setIsAuthenticated(false);
        clearRefreshTimer();
        return false;
      }

      const data = await response.json();
      
      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        scheduleTokenRefresh();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      setUser(null);
      setIsAuthenticated(false);
      clearRefreshTimer();
      return false;
    } finally {
      isRefreshingRef.current = false;
    }
  }, [clearRefreshTimer, scheduleTokenRefresh]);

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/v2/me`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
        scheduleTokenRefresh();
      } else if (response.status === 401) {
        const refreshed = await refreshToken();
        if (!refreshed) {
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Fetch user error:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [refreshToken, scheduleTokenRefresh]);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await fetchUser();
      setIsLoading(false);
    };

    initAuth();

    return () => {
      clearRefreshTimer();
    };
  }, [fetchUser, clearRefreshTimer]);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/v2/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    setUser(data.user || data);
    setIsAuthenticated(true);
    scheduleTokenRefresh();
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await fetch(`${API_URL}/api/auth/v2/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, name }),
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    setUser(data.user || data);
    setIsAuthenticated(true);
    scheduleTokenRefresh();
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/v2/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      clearRefreshTimer();
    }
  };

  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        refreshToken,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
