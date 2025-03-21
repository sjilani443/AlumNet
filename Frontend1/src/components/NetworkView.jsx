import React from 'react';
import { UserPlus, Users } from 'lucide-react';

export default function NetworkView() {
  const connections = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Senior Software Engineer',
      company: 'Google',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&fit=crop',
      mutualConnections: 12
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Product Manager',
      company: 'Microsoft',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&fit=crop',
      mutualConnections: 8
    }
  ];

  const recommendations = [
    {
      id: 3,
      name: 'Priya Patel',
      role: 'Data Scientist',
      company: 'Amazon',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&fit=crop',
      mutualConnections: 5
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'Software Developer',
      company: 'Apple',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&fit=crop',
      mutualConnections: 3
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Network</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((connection) => (
            <div key={connection.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={connection.avatar}
                    alt={connection.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{connection.name}</h3>
                    <p className="text-sm text-gray-600">{connection.role}</p>
                    <p className="text-sm text-gray-500">{connection.company}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  {connection.mutualConnections} mutual connections
                </div>

                <div className="mt-6 flex space-x-3">
                  <button className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200">
                    Message
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Connections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((recommendation) => (
            <div key={recommendation.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={recommendation.avatar}
                    alt={recommendation.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{recommendation.name}</h3>
                    <p className="text-sm text-gray-600">{recommendation.role}</p>
                    <p className="text-sm text-gray-500">{recommendation.company}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  {recommendation.mutualConnections} mutual connections
                </div>

                <div className="mt-6 flex space-x-3">
                  <button className="flex-1 px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors duration-200">
                    Ignore
                  </button>
                  <button className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Connect
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}