import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import HomePage from './HomePage';
import JobsPage from './JobsPage';
import EventsPage from './EventsPage';
import MessagesPage from './MessagesPage';
import NetworkPage from './NetworkPage';
import NotificationsPage from './NotificationsPage';
import ResourcesPage from './ResourcesPage';
import ProfilePage from './ProfilePage';
import CompaniesPage from './CompaniesPage';
import CompanyDetails from '../components/CompanyDetails';

const queryClient = new QueryClient();

export default function StudentHome() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="min-h-screen bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="text-center">
          <span className="text-sm font-medium text-primary-500">
            Welcome, Student 👋
          </span>
        </div>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="network" element={<NetworkPage />} />
          {/* <Route path="notifications" element={<NotificationsPage />} /> */}
          {/* <Route path="resources" element={<ResourcesPage />} /> */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="companies" element={<CompaniesPage />} />
          <Route path="company/:companyName" element={<CompanyDetails />} />
        </Routes>
      </div>
    </QueryClientProvider>
  );
}
