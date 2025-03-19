import React from 'react';
import { BookOpen, Download, ExternalLink, PlayCircle } from 'lucide-react';

export default function ResourcesPage() {
  const resources = [
    {
      id: 1,
      type: 'document',
      title: 'Alumni Success Guide',
      description: 'A comprehensive guide for career development and networking',
      category: 'Career Development',
      downloadUrl: '#'
    },
    {
      id: 2,
      type: 'video',
      title: 'Tech Interview Preparation',
      description: 'Tips and strategies from successful alumni',
      category: 'Interview Prep',
      videoUrl: '#'
    },
    {
      id: 3,
      type: 'link',
      title: 'Industry Research Reports',
      description: 'Latest trends and insights in technology',
      category: 'Industry Insights',
      externalUrl: '#'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center space-x-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
        <div className="flex-1">
          <div className="relative max-w-xs">
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-primary-50 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">{resource.category}</span>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">{resource.title}</h3>
            <p className="text-gray-600 text-sm mb-6">{resource.description}</p>

            {resource.type === 'document' && (
              <button className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
            )}

            {resource.type === 'video' && (
              <button className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200">
                <PlayCircle className="h-4 w-4 mr-2" />
                Watch Video
              </button>
            )}

            {resource.type === 'link' && (
              <button className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Resource
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}