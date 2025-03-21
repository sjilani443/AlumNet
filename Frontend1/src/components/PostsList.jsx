import React from 'react';
import { ThumbsUp, MessageSquare, Share2, Bookmark } from 'lucide-react';

export default function PostsList() {
  const posts = [
    {
      id: 1,
      author: {
        name: 'Dr. Rajesh Kumar',
        role: 'Professor, Computer Science',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&fit=crop'
      },
      content: 'Excited to announce our department\'s latest research publication on Quantum Computing applications in Cryptography. This breakthrough could revolutionize how we approach data security.',
      timestamp: '2 hours ago',
      likes: 156,
      comments: 23,
      tags: ['Research', 'Quantum Computing', 'Cryptography']
    },
    {
      id: 2,
      author: {
        name: 'Priya Sharma',
        role: 'Alumni, Class of 2020',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&fit=crop'
      },
      content: 'Just completed my first year at Google! Grateful for the foundation SRM AP provided. Happy to mentor current students interested in software engineering careers.',
      timestamp: '1 day ago',
      likes: 243,
      comments: 45,
      tags: ['Career', 'Alumni', 'Mentorship']
    }
  ];

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                <p className="text-sm text-gray-600">{post.author.role}</p>
                <p className="text-xs text-gray-500">{post.timestamp}</p>
              </div>
            </div>

            <p className="mt-4 text-gray-700 leading-relaxed">{post.content}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex space-x-6">
                <button className="flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  <ThumbsUp className="h-5 w-5 mr-1" />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button className="flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  <MessageSquare className="h-5 w-5 mr-1" />
                  <span className="text-sm">{post.comments}</span>
                </button>
                <button className="flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  <Share2 className="h-5 w-5 mr-1" />
                  <span className="text-sm">Share</span>
                </button>
              </div>
              <button className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                <Bookmark className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}