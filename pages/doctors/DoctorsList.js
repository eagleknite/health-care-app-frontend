// pages\doctors\DoctorsList.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctors, deleteDoctor } from '@/slices/doctorSlice';
import Link from 'next/link';
import DoctorDetail from './[id]';  // Import the DoctorDetail component

const DoctorsList = () => {
  const dispatch = useDispatch();
  const { doctors, loading, error } = useSelector(state => state.doctors);
  const { user } = useSelector(state => state.auth); // Get the logged-in user

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);
  
  const handleDelete = async (id) => {
    await dispatch(deleteDoctor(id));
  };

  if (loading === 'loading') return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>All Doctors</h1>
      {doctors.map((doctor, index) => (
        <div key={index}>
          <DoctorDetail doctorId={doctor._id} />  {/* Use the DoctorDetail component */}
          {user && user.role === 'admin' && (  // Only show the following buttons if user is an admin
            <>
              <Link href={`/doctors/edit/${doctor._id}`}>
                <button>Edit</button>
              </Link>
              <button onClick={() => handleDelete(doctor._id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default DoctorsList;

