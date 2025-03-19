import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const signUp = async (email: string, password: string, userData: any) => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;

  if (authData.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: authData.user.id, ...userData }]);

    if (profileError) throw profileError;
  }

  return authData;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Profile operations
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const updateProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;
  return data;
};

// Company operations
export const getCompanies = async () => {
  const { data, error } = await supabase
    .from('companies')
    .select('*');

  if (error) throw error;
  return data;
};

export const getCompanyAlumni = async (companyId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('company_id', companyId);

  if (error) throw error;
  return data;
};

// Job operations
export const getJobs = async () => {
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      companies (*),
      profiles (*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createJob = async (jobData: any) => {
  const { data, error } = await supabase
    .from('jobs')
    .insert([jobData]);

  if (error) throw error;
  return data;
};

// Event operations
export const getEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      profiles (*)
    `)
    .order('event_date', { ascending: true });

  if (error) throw error;
  return data;
};

export const joinEvent = async (eventId: string, userId: string) => {
  const { data, error } = await supabase
    .from('event_participants')
    .insert([{ event_id: eventId, user_id: userId }]);

  if (error) throw error;
  return data;
};

// Post operations
export const getPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (*),
      comments (
        *,
        profiles (*)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createPost = async (postData: any) => {
  const { data, error } = await supabase
    .from('posts')
    .insert([postData]);

  if (error) throw error;
  return data;
};

// Connection operations
export const getConnections = async (userId: string) => {
  const { data, error } = await supabase
    .from('connections')
    .select(`
      *,
      connected_profile:profiles!connections_connected_user_id_fkey(*)
    `)
    .eq('user_id', userId)
    .eq('status', 'accepted');

  if (error) throw error;
  return data;
};

export const sendConnectionRequest = async (userId: string, connectedUserId: string) => {
  const { data, error } = await supabase
    .from('connections')
    .insert([{ user_id: userId, connected_user_id: connectedUserId }]);

  if (error) throw error;
  return data;
};

// Message operations
export const getMessages = async (userId: string, otherUserId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

export const sendMessage = async (senderId: string, receiverId: string, content: string) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ sender_id: senderId, receiver_id: receiverId, content }]);

  if (error) throw error;
  return data;
};