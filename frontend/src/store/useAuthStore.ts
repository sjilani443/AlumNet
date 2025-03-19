import create from 'zustand';
import { jwtDecode } from 'jwt-decode';
import { login, register } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'alumni';
  company?: string;
  position?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'alumni';
    company?: string;
    position?: string;
  }) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (email: string, password: string) => {
    try {
      const { token } = await login({ email, password });
      localStorage.setItem('token', token);
      const decoded = jwtDecode<{ id: string; role: string }>(token);
      set({ token, isAuthenticated: true, user: decoded as unknown as User });
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      await register(userData);
      // After successful registration, log the user in
      const { token } = await login({
        email: userData.email,
        password: userData.password,
      });
      localStorage.setItem('token', token);
      const decoded = jwtDecode<{ id: string; role: string }>(token);
      set({ token, isAuthenticated: true, user: decoded as unknown as User });
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));