import create from 'zustand';
import { supabase } from '../lib/supabase';

export const useStore = create((set) => ({
  // Auth
  user: null,
  setUser: (user) => set({ user }),

  // Companies
  companies: [],
  fetchCompanies: async () => {
    const { data } = await supabase.from('companies').select('*');
    if (data) set({ companies: data });
  },
  selectedCompany: null,
  setSelectedCompany: (company) => set({ selectedCompany: company }),

  // Jobs
  jobs: [],
  fetchJobs: async () => {
    const { data } = await supabase
      .from('jobs')
      .select('*, companies (*), profiles (*)')
      .order('created_at', { ascending: false });
    if (data) set({ jobs: data });
  },

  // Events
  events: [],
  fetchEvents: async () => {
    const { data } = await supabase
      .from('events')
      .select('*, profiles (*)')
      .order('event_date', { ascending: true });
    if (data) set({ events: data });
  },

  // Posts
  posts: [],
  fetchPosts: async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles (*), comments (*, profiles (*))')
      .order('created_at', { ascending: false });
    if (data) set({ posts: data });
  },
}));
