import create from 'zustand';
import { jwtDecode } from 'jwt-decode';
import { login, register } from '../lib/api';
import axios from 'axios';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (email, password, role) => {
    try {
      const response = await login({ email, password, role }); // pass role
      const { token, user } = response;
  
      localStorage.setItem('token', token);
      localStorage.setItem('email', user.email);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('role', role); // use correct role from DB
  
      const decoded = jwtDecode(token);
      set({ token, isAuthenticated: true, user: decoded });
    } catch (error) {
      throw error;
    }
  },
  
  

  register: async (data) => {
    try {
      // Adding missing fields in the data
      const registerData = {
        ...data,
        graduationYear: data.graduationYear || '2023',  // Add a default value or get it from the form
        branch: data.branch || 'Computer Science',
        role: data.role || 'student',          
      };
  
      const res = await axios.post('http://localhost:5000/api/auth/register', registerData);
      return res.data;
    } catch (err) {
      console.error('Registration Error:', err.response ? err.response.data : err);
      throw err;
    }
  },
  
  

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
