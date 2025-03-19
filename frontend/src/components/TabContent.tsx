import React from 'react';
import { Briefcase, Calendar, GraduationCap, MessageSquare } from 'lucide-react';

interface TabContentProps {
  activeTab: string;
}

export default function TabContent({ activeTab }: TabContentProps) {
  const renderAlumni = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {[1, 2, 3, 4, 5, 6].map((alumni) => (
        <div key={alumni} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start space-x-4">
            <img
              src={`https://i.pravatar.cc/150?img=${alumni}`}
              alt="Alumni"
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h3 className="font-semibold">Sarah Johnson</h3>
              <p className="text-sm text-gray-600">Senior Software Engineer at Google</p>
              <p className="text-sm text-gray-500">Class of 2019</p>
              <div className="mt-2">
                <button className="text-sm text-indigo-600 hover:text-indigo-800">Connect</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderJobs = () => (
    <div className="space-y-6 mt-6">
      {[1, 2, 3].map((job) => (
        <div key={job} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">Senior Software Engineer</h3>
              <p className="text-gray-600">Google • Mountain View, CA</p>
              <div className="flex items-center mt-2 space-x-4">
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Full-time</span>
                <span className="text-sm text-gray-500">Posted by John Doe (Alumni)</span>
              </div>
            </div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
              Request Referral
            </button>
          </div>
          <p className="mt-4 text-gray-600">
            We are looking for an experienced software engineer to join our team...
          </p>
        </div>
      ))}
    </div>
  );

  const renderPosts = () => (
    <div className="space-y-6 mt-6">
      {[1, 2, 3].map((post) => (
        <div key={post} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start space-x-4">
            <img
              src={`https://i.pravatar.cc/150?img=${post}`}
              alt="Author"
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <h3 className="font-semibold">The Future of AI in Tech Industry</h3>
              <p className="text-sm text-gray-500">Posted by Mark Wilson • 2 hours ago</p>
              <p className="mt-2 text-gray-600">
                Latest trends show that AI is revolutionizing how we approach software development...
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <button className="text-gray-500 hover:text-indigo-600 flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>24 comments</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEvents = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {[1, 2, 3, 4, 5, 6].map((event) => (
        <div key={event} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Company Event</span>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <h3 className="font-semibold">Tech Talk: Future of AI</h3>
          <p className="text-sm text-gray-600 mt-1">March 15, 2024 • 2:00 PM</p>
          <p className="text-sm text-gray-600">Virtual Event</p>
          <p className="text-sm text-gray-500 mt-2">
            Join us for an insightful discussion about the future of AI...
          </p>
          <button className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Register Now
          </button>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'alumni':
        return renderAlumni();
      case 'jobs':
        return renderJobs();
      case 'posts':
        return renderPosts();
      case 'events':
        return renderEvents();
      default:
        return null;
    }
  };

  return <div>{renderContent()}</div>;
}