import dynamic from 'next/dynamic';
import RootLayout from '../pegawai/profile/edit/layout'; // Mengimpor layout dari home/layout.js


// Dynamic import hanya untuk Client Component
const Dashboard = dynamic(() => import('../../components/dashboard'));

export default function DashboardPage() {
  return (
    <RootLayout>
    <div>
      <Dashboard />
    </div>
    </RootLayout>
  );
}
