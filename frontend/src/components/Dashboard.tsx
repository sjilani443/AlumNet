import React from 'react';
import { Briefcase, Calendar, Users, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Active Jobs</h3>
            <Briefcase className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold mt-2">24</p>
          <p className="text-sm text-gray-500">Open positions</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Upcoming Events</h3>
            <Calendar className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold mt-2">8</p>
          <p className="text-sm text-gray-500">This week</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Connections</h3>
            <Users className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold mt-2">156</p>
          <p className="text-sm text-gray-500">Active network</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Industry Updates</h3>
            <TrendingUp className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold mt-2">12</p>
          <p className="text-sm text-gray-500">New posts today</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Job Postings</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((job) => (
                <div key={job} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <h3 className="font-semibold">Senior Software Engineer</h3>
                  <p className="text-sm text-gray-600">Google • Mountain View, CA</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Full-time</span>
                    <span className="text-xs text-gray-500">Posted 2 days ago</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((event) => (
                <div key={event} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <h3 className="font-semibold">Tech Talk: Future of AI</h3>
                  <p className="text-sm text-gray-600">Virtual • March 15, 2024</p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Company Event</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}