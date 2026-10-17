import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthResponse } from '../types/index.js';
import { api } from '../services/api.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isOfficer: boolean;
  login: (authData: AuthResponse) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('meeseva_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('meeseva_token');
  });

  useEffect(() => {
    if (token) {
      refreshProfile().catch(() => {
        logout();
      });
    }
  }, []);

  const login = (authData: AuthResponse) => {
    setUser(authData.user);
    setToken(authData.token);
    localStorage.setItem('meeseva_token', authData.token);
    localStorage.setItem('meeseva_user', JSON.stringify(authData.user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('meeseva_token');
    localStorage.removeItem('meeseva_user');
  };

  const refreshProfile = async () => {
    try {
      const res = await api.getProfile();
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('meeseva_user', JSON.stringify(res.user));
      }
    } catch {
      // Ignored
    }
  };

  const isOfficer = user?.role === 'officer' || user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isOfficer,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

