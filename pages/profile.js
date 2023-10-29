// pages/Profile.js
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '@/slices/authSlice';  // Import the action
import EditDoctor from './doctors/edit/[id]';
import EditPatient from './patients/edit/[id]';
import Header from './components/common/Header';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const [error, setError] = useState(null);  // [1] Add error state

  // console.log('User data in Profile:', user);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        dispatch(fetchProfile());
      } catch (error) {
        setError(error.message);  // [2] Set error state
      }
    };
    fetchUser();
  }, [dispatch]); 

  const renderEditProfileBasedOnRole = () => {
    if (!user || !user.role) return <p>Loading...</p>;
    switch (user.role) {
      case 'Admin':
        return <p>Welcome Admin! There&apos;s  nothing to update here.</p>;
      case 'Doctor':
        return <EditDoctor existingDoctor={user} doctorId={user.id} />;
      case 'Patient':
        return <EditPatient existingPatient={user} patientId={user.id} />;
      default:
        return <p>Invalid role</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-6 bg-white shadow-md mt-6 rounded">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Profile</h1>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : user ? (
          <>
            <p className="text-gray-600">Email: {user.email}</p>
            <p className="text-gray-600">Role: {user.role}</p>
            <p className="text-gray-600">First Name: {user.firstName}</p>
            <p className="text-gray-600">Last Name: {user.lastName}</p>
            {renderEditProfileBasedOnRole()}
          </>
        ) : (
          <p className="text-gray-600">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
