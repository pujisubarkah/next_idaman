import React from 'react';
import Header from '../../components/header';
import Navbar from '../../components/navbar';
import CustomSidebar from '../../components/customsidebar';
import Dashboard from '../../components/dashboard';

export default function DashboardPage() {
  return (
    <div>
      <Header />
      <Navbar />

      {/* Main layout */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64">
          <CustomSidebar />
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 bg-gray-100">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}
