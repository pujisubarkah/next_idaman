import Header from '../../components/header';
import Navbar from '../../components/navbar';
import CustomSidebar from '../../components/customsidebar';
import dynamic from 'next/dynamic';

// Dynamic import hanya untuk Client Component
const Dashboard = dynamic(() => import('../../components/dashboard'));

export default function DashboardPage() {
  return (
    <div>
      <Header />
      <Navbar />
      <div className="flex">
        <div className="w-64">
          <CustomSidebar />
        </div>
        <div className="flex-1 p-6 bg-gray-100">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}
