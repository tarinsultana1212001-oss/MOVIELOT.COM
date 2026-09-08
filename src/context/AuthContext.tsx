import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { apiClient } from '../services/apiClient';

export const HARDCODED_ADMIN_EMAIL = 'tarinsultana1212001@gmail.com';
export const HARDCODED_ADMIN_PASSWORD = '1122';

export const HARDCODED_ADMIN_USER: User = {
  id: 'usr_admin_tarin_01',
  name: 'Tarin Sultana (Admin)',
  email: HARDCODED_ADMIN_EMAIL,
  role: 'admin',
  createdAt: '2026-09-08T00:00:00.000Z',
  lastLoginAt: new Date().toISOString()
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  adminAccessEnabled: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, enableAdmin?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  toggleAdminAccess: () => void;
  setAdminAccess: (enabled: boolean) => void;
  validateAdminCredentials: (email: string, pass: string) => boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  setAuthModalTab: (tab: 'login' | 'register') => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'movielot_auth_token';
const USER_KEY = 'movielot_auth_user';
const ADMIN_ACCESS_KEY = 'movielot_admin_access_enabled';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY) || null;
  });

  const [adminAccessEnabled, setAdminAccessEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(ADMIN_ACCESS_KEY);
    return saved !== null ? saved === 'true' : true;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  // Validate stored session on mount
  useEffect(() => {
    async function verifySession() {
      if (!token) return;

      // Preserve root admin session across server reloads
      if (
        user?.email?.toLowerCase() === HARDCODED_ADMIN_EMAIL.toLowerCase() ||
        token.startsWith('ml_sess_admin_tarin_')
      ) {
        const adminUser: User = {
          ...HARDCODED_ADMIN_USER,
          role: adminAccessEnabled ? 'admin' : 'user',
          lastLoginAt: user?.lastLoginAt || new Date().toISOString()
        };
        setUser(adminUser);
        localStorage.setItem(USER_KEY, JSON.stringify(adminUser));
        return;
      }

      try {
        const response = await apiClient.getCurrentUser(token);
        if (response.user) {
          setUser(response.user);
          localStorage.setItem(USER_KEY, JSON.stringify(response.user));
        }
      } catch {
        // Session expired or invalid
        setUser(null);
        setToken(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    verifySession();
  }, [token, adminAccessEnabled]);

  const openAuthModal = useCallback((tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setError(null);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const validateAdminCredentials = useCallback((email: string, pass: string): boolean => {
    return (
      email.trim().toLowerCase() === HARDCODED_ADMIN_EMAIL.toLowerCase() &&
      pass.trim() === HARDCODED_ADMIN_PASSWORD
    );
  }, []);

  const toggleAdminAccess = useCallback(() => {
    setAdminAccessEnabled((prev) => {
      const nextVal = !prev;
      localStorage.setItem(ADMIN_ACCESS_KEY, String(nextVal));
      if (user && user.email.toLowerCase() === HARDCODED_ADMIN_EMAIL.toLowerCase()) {
        const updatedUser: User = {
          ...user,
          role: nextVal ? 'admin' : 'user'
        };
        setUser(updatedUser);
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      }
      return nextVal;
    });
  }, [user]);

  const setAdminAccess = useCallback((enabled: boolean) => {
    setAdminAccessEnabled(enabled);
    localStorage.setItem(ADMIN_ACCESS_KEY, String(enabled));
    if (user && user.email.toLowerCase() === HARDCODED_ADMIN_EMAIL.toLowerCase()) {
      const updatedUser: User = {
        ...user,
        role: enabled ? 'admin' : 'user'
      };
      setUser(updatedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    }
  }, [user]);

  const login = useCallback(async (email: string, password: string, enableAdmin = true) => {
    setLoading(true);
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // Direct validation for hardcoded admin credentials
    if (cleanEmail === HARDCODED_ADMIN_EMAIL.toLowerCase()) {
      if (cleanPass !== HARDCODED_ADMIN_PASSWORD) {
        setLoading(false);
        const err = 'Invalid administrator credentials. Password does not match (1122).';
        setError(err);
        throw new Error(err);
      }

      // Set admin access toggle state
      setAdminAccessEnabled(enableAdmin);
      localStorage.setItem(ADMIN_ACCESS_KEY, String(enableAdmin));

      try {
        const res = await apiClient.login({ email: cleanEmail, password: cleanPass });
        const adminUser: User = {
          ...res.user,
          role: enableAdmin ? 'admin' : 'user'
        };
        setUser(adminUser);
        setToken(res.token);
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(adminUser));
      } catch {
        // Guaranteed fallback session for admin
        const fallbackToken = 'ml_sess_admin_tarin_01';
        const fallbackUser: User = {
          ...HARDCODED_ADMIN_USER,
          role: enableAdmin ? 'admin' : 'user',
          lastLoginAt: new Date().toISOString()
        };
        setUser(fallbackUser);
        setToken(fallbackToken);
        localStorage.setItem(TOKEN_KEY, fallbackToken);
        localStorage.setItem(USER_KEY, JSON.stringify(fallbackUser));
      }

      setIsAuthModalOpen(false);
      setLoading(false);
      return;
    }

    // Standard User Login
    try {
      const res = await apiClient.login({ email: cleanEmail, password: cleanPass });
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      setIsAuthModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials. Please try again.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.register({ name, email, password });
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      setIsAuthModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    if (token) {
      try {
        await apiClient.logout(token);
      } catch {
        // Continue cleanup
      }
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, [token]);

  const isAuthenticated = !!user && !!token;
  const isRootAdmin = user?.email?.toLowerCase() === HARDCODED_ADMIN_EMAIL.toLowerCase();
  const isAdmin = !!user && (user.role === 'admin' || (isRootAdmin && adminAccessEnabled));

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        adminAccessEnabled,
        loading,
        error,
        login,
        register,
        logout,
        toggleAdminAccess,
        setAdminAccess,
        validateAdminCredentials,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        setAuthModalTab,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

