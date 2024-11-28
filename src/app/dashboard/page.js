
import dynamic from 'next/dynamic';

// Dynamic import hanya untuk Client Component
const Dashboard = dynamic(() => import('../../components/dashboard'));

export default function DashboardPage() {
  return (
    <div>
      <Dashboard />
    </div>
  );
}
