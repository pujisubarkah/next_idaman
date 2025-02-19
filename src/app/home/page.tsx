'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import RootLayout from '../pegawai/profile/edit/layout'; // Layout import

// Dynamic imports for client-side only components
const Dashboard = dynamic(() => import('../../components/dashboard'));
const DashboardUser = dynamic(() => import('../../components/dashboarduser')); // Dashboard for role_id 4

const HomePage = () => {
  const [roleId, setRoleId] = useState(null);

  useEffect(() => {
    // Retrieve and parse role_id from localStorage
    const storedData = localStorage.getItem('user'); // Assuming the key is 'user_data'
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData); // Parse the JSON string
        setRoleId(parsedData.role_id); // Access role_id
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
      }
    }
  }, []);

  return (
    <RootLayout>
      <div>
        {roleId === 1 && <Dashboard />} {/* Dashboard for role_id 1 */}
        {roleId === 4 && <DashboardUser />} {/* Dashboard for role_id 4 */}
        {roleId !== 1 && roleId !== 4 && <div>Loading...</div>} {/* Waiting for role_id or fallback UI */}
      </div>
    </RootLayout>
  );
};

export default HomePage;

