// pages/dashboard.js
import Dashboard from '@/pages/dashboards/Dashboard';
import Header from './components/common/Header';

const DashboardPage = () => {
  return (
    <div>
        <Header />
      <h1>Main Dashboard</h1>
      <Dashboard />
    </div>
  );
};

export default DashboardPage;
