import create from 'zustand';
import { jwtDecode } from 'jwt-decode';
import { login, register } from '../lib/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (email, password) => {
    try {
      const { token } = await login({ email, password });
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      set({ token, isAuthenticated: true, user: decoded });
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      await register(userData);
      const { token } = await login({
        email: userData.email,
        password: userData.password,
      });
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      set({ token, isAuthenticated: true, user: decoded });
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
