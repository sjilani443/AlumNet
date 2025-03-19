export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'alumni';
  avatar?: string;
  title?: string;
  company?: string;
  graduationYear?: number;
  connections: string[];
  bio?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  postedBy: string;
  postedDate: Date;
  status: 'open' | 'closed';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  type: 'college' | 'company';
  organizer: string;
  participants: string[];
  maxParticipants?: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  likes: string[];
  comments: Comment[];
  category: 'industry-news' | 'career-advice' | 'general';
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
}