// components/Dashboard.js
import { useSelector } from 'react-redux';
import AdminDashboard from '@/pages/dashboards/AdminDashboard'
import DoctorDashboard from '@/pages/dashboards/DoctorDashboard'
import PatientDashboard from '@/pages/dashboards/PatientDashboard'

const Dashboard = () => {
  const user = useSelector(state => state.auth.user);
  const userRole = user ? user.role : null;  // Null check here

  console.log("Current User Role:", userRole);  // Debug log

  return (
    <div>
      {userRole === 'Admin' && <AdminDashboard />}
      {userRole === 'Doctor' && <DoctorDashboard />}
      {userRole === 'Patient' && <PatientDashboard />}
    </div>
  );
};

export default Dashboard;
