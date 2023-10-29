// pages\doctors\edit\[id].js
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react'; // <-- Import useState
import { fetchSingleDoctor } from '@/slices/doctorSlice';
import DoctorForm from '../DoctorForm';

const EditDoctor = ({ doctorId }) => {
  const router = useRouter();
  const [currentId, setCurrentId] = useState(doctorId || null); 
  const dispatch = useDispatch();

  // console.log('Received doctorId in EditDoctor:', doctorId);

  useEffect(() => {
    if (!currentId) {
      setCurrentId(router.query.id || doctorId); // <-- Also check doctorId prop
      // console.log("ID set:", router.query.id || doctorId);
    }
  }, [router.query.id, doctorId]);  // <-- Add doctorId to the dependency array

  useEffect(() => {
    console.log("Inside useEffect");

    if (currentId) {
      // console.log("Dispatching fetchSingleDoctor with ID:", currentId);
      dispatch(fetchSingleDoctor(currentId));
    } else {
      // console.log("Doctor ID not available yet");
    }
  }, [currentId]); 

  const { doctors, loading } = useSelector(state => state.doctors);
  const existingDoctor = doctors.find(doc => doc._id === currentId);

  if (loading === 'loading' || !existingDoctor) {
    return <p>Loading...</p>;
  }

  // console.log("Doctor data loaded:", existingDoctor);

  return (
    <div>
      <h1>Edit Doctor</h1>
      <DoctorForm existingDoctor={existingDoctor} />
    </div>
  );
};

export default EditDoctor;

