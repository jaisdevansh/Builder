import { create } from 'zustand';
import axios from 'axios';

interface User {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
  provider?: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // OAuth social login (Google ID token / GitHub code)
  loginWithOAuth: (credential: string, provider: 'google' | 'github') => Promise<void>;
  // Google code callback
  loginWithGoogleCode: (code: string) => Promise<void>;
  // GitHub code callback
  loginWithGithubCode: (code: string) => Promise<void>;
  // Email / password
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  // Shared
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const persist = (key: string, value: unknown) =>
  localStorage.setItem(key, JSON.stringify(value));

const hydrate = <T>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const setSession = (token: string, user: User) => {
  localStorage.setItem('token', token);
  persist('user', user);
};

const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const getErrorMessage = (err: unknown, defaultMessage: string): string => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.error || err.message;
  }
  return defaultMessage;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: hydrate<User>('user'),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  // ── Google ID-token (used by @react-oauth/google popup) ──────────
  loginWithOAuth: async (credential, provider) => {
    set({ isLoading: true, error: null });
    try {
      const endpoint = provider === 'google' ? '/auth/google' : '/auth/github/callback';
      const { data } = await axios.post(`${API_URL}${endpoint}`, { credential });
      setSession(data.token, data.user);
      set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
    } catch (err) {
      const msg = getErrorMessage(err, 'Authentication failed');
      set({ isLoading: false, error: msg });
      throw new Error(msg, { cause: err });
    }
  },

  // ── Google OAuth code (redirect callback) ───────────────────────
  loginWithGoogleCode: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post(`${API_URL}/auth/google/callback`, { code });
      setSession(data.token, data.user);
      set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
    } catch (err) {
      const msg = getErrorMessage(err, 'Google authentication failed');
      set({ isLoading: false, error: msg });
      throw new Error(msg, { cause: err });
    }
  },

  // ── GitHub OAuth code (redirect callback) ───────────────────────
  loginWithGithubCode: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post(`${API_URL}/auth/github/callback`, { code });
      setSession(data.token, data.user);
      set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
    } catch (err) {
      const msg = getErrorMessage(err, 'GitHub authentication failed');
      set({ isLoading: false, error: msg });
      throw new Error(msg, { cause: err });
    }
  },

  // ── Email signup ─────────────────────────────────────────────────
  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post(`${API_URL}/auth/signup`, { name, email, password });
      setSession(data.token, data.user);
      set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
    } catch (err) {
      const msg = getErrorMessage(err, 'Signup failed');
      set({ isLoading: false, error: msg });
      throw new Error(msg, { cause: err });
    }
  },

  // ── Email login ──────────────────────────────────────────────────
  loginWithEmail: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
      setSession(data.token, data.user);
      set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
    } catch (err) {
      const msg = getErrorMessage(err, 'Login failed');
      set({ isLoading: false, error: msg });
      throw new Error(msg, { cause: err });
    }
  },

  // ── Forgot Password ────────────────────────────────────────────────
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      set({ isLoading: false });
    } catch (err) {
      const msg = getErrorMessage(err, 'Failed to send reset email');
      set({ isLoading: false, error: msg });
      throw new Error(msg, { cause: err });
    }
  },

  // ── Reset Password ─────────────────────────────────────────────────
  resetPassword: async (token, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/auth/reset-password`, { token, newPassword });
      set({ isLoading: false });
    } catch (err) {
      const msg = getErrorMessage(err, 'Failed to reset password');
      set({ isLoading: false, error: msg });
      throw new Error(msg, { cause: err });
    }
  },

  // ── Logout ───────────────────────────────────────────────────────
  logout: () => {
    const token = get().token;
    clearSession();
    set({ user: null, token: null, isAuthenticated: false });
    if (token) {
      axios
        .post(`${API_URL}/auth/logout`, {}, { headers: { Authorization: `Bearer ${token}` } })
        .catch(() => {});
    }
  },

  // ── Validate stored token ─────────────────────────────────────────
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }
    try {
      const { data } = await axios.get(`${API_URL}/auth/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        set({ user: data.user, token, isAuthenticated: true });
      } else {
        throw new Error('Auth check failed');
      }
    } catch {
      clearSession();
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  clearError: () => set({ error: null }),
}));
