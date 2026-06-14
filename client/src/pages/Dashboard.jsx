import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import WorkerDashboard from './WorkerDashboard';
import CitizenDashboard from './CitizenDashboard';

/**
 * Dashboard Page
 * Routes to the appropriate role-based dashboard.
 */
const Dashboard = () => {
  const { user } = useAuth();

  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'worker') return <WorkerDashboard />;
  return <CitizenDashboard />;
};

export default Dashboard;
