import React from 'react';
import { Bell, Calendar, Users, Briefcase } from 'lucide-react';

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: 'connection',
      title: 'New Connection Request',
      message: 'Sarah Johnson wants to connect with you',
      time: '5 min ago',
      icon: Users,
      color: 'blue'
    },
    {
      id: 2,
      type: 'event',
      title: 'Event Reminder',
      message: 'Tech Talk: Future of AI starts in 1 hour',
      time: '1 hour ago',
      icon: Calendar,
      color: 'green'
    },
    {
      id: 3,
      type: 'job',
      title: 'New Job Referral',
      message: 'A new position at Google matches your profile',
      time: '2 hours ago',
      icon: Briefcase,
      color: 'purple'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Notifications</h1>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4"
          >
            <div className="flex items-start space-x-4">
              <div className={`p-2 bg-${notification.color}-100 rounded-lg`}>
                <notification.icon className={`h-5 w-5 text-${notification.color}-600`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                <span className="text-xs text-gray-500 mt-2 block">{notification.time}</span>
              </div>
              <button className="text-gray-400 hover:text-gray-500">
                <Bell className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}