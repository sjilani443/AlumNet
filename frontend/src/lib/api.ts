import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const register = async (userData: {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'alumni';
  company?: string;
  position?: string;
}) => {
  const response = await api.post('/auth/register', userData);
  console.log(userData)
  return response.data;
};

export const login = async (credentials: { email: string; password: string }) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// Connection APIs
export const sendConnectionRequest = async (receiverId: string) => {
  const response = await api.post('/connections/request', { receiverId });
  return response.data;
};

export const updateConnectionStatus = async (requestId: string, status: 'accepted' | 'declined') => {
  const response = await api.put(`/connections/${requestId}`, { status });
  return response.data;
};

// Job APIs
export const postJob = async (jobData: {
  company: string;
  position: string;
  description: string;
  requirements: string[];
  location: string;
  type: string;
  referralLink?: string;
}) => {
  const response = await api.post('/jobs', jobData);
  return response.data;
};

export const getJobs = async () => {
  const response = await api.get('/jobs');
  return response.data;
};

export const getJob = async (id: string) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};

export const applyForJob = async (jobId: string) => {
  const response = await api.post(`/jobs/${jobId}/apply`);
  return response.data;
};

export default api;