export const User = {
  id: '',
  name: '',
  email: '',
  role: 'student', // or 'alumni'
  avatar: '',
  title: '',
  company: '',
  graduationYear: null,
  connections: [],
  bio: '',
};

export const Job = {
  id: '',
  title: '',
  company: '',
  location: '',
  description: '',
  requirements: [],
  postedBy: '',
  postedDate: new Date(),
  status: 'open', // or 'closed'
};

export const Event = {
  id: '',
  title: '',
  description: '',
  date: new Date(),
  location: '',
  type: 'college', // or 'company'
  organizer: '',
  participants: [],
  maxParticipants: null,
};

export const Post = {
  id: '',
  title: '',
  content: '',
  author: '',
  createdAt: new Date(),
  likes: [],
  comments: [],
  category: 'general', // 'industry-news' or 'career-advice'
};

export const Comment = {
  id: '',
  content: '',
  author: '',
  createdAt: new Date(),
};
