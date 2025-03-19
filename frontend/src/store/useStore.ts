import create from 'zustand';
import { supabase } from '../lib/supabase';
import { User, Company, Job, Event, Post } from '../types';

interface Store {
  // Auth
  user: User | null;
  setUser: (user: User | null) => void;

  // Companies
  companies: Company[];
  fetchCompanies: () => Promise<void>;
  selectedCompany: Company | null;
  setSelectedCompany: (company: Company | null) => void;

  // Jobs
  jobs: Job[];
  fetchJobs: () => Promise<void>;

  // Events
  events: Event[];
  fetchEvents: () => Promise<void>;

  // Posts
  posts: Post[];
  fetchPosts: () => Promise<void>;
}

export const useStore = create<Store>((set) => ({
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