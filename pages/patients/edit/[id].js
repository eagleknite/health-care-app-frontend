// pages\patients\edit\[id].js
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react'; // <-- Import useState
import { fetchSinglePatient } from '@/slices/patientSlice';
import PatientForm from '../PatientForm';

const EditPatient = ({ patientId }) => {
  const router = useRouter();
  const [currentId, setCurrentId] = useState(patientId || null);
  const { patients, loading } = useSelector(state => state.patients);
  const existingPatient = patients.find(p => p._id === currentId);
  const dispatch = useDispatch();

  // console.log('Received patientId in EditPatient:', patientId);

  useEffect(() => {
    if (!currentId) {
      setCurrentId(router.query.id || patientId); // <-- Also check patientId prop
      // console.log("ID set:", router.query.id || patientId);
    }
  }, [router.query.id, patientId, currentId]); // <-- Add patientId to the dependency array

  useEffect(() => {
    console.log("Inside useEffect");

    if (currentId) {
      // console.log("Dispatching fetchSinglePatient with ID:", currentId);
      dispatch(fetchSinglePatient(currentId));
    } else {
      // console.log("Patient ID not available yet");
    }
  }, [currentId, dispatch]);

  if (loading === 'loading' || !existingPatient) {
    return <p>Loading...</p>;
  }

  // console.log("Patient data loaded:", existingPatient);

  return (
    <div>
      <h1>Edit Patient</h1>
      <PatientForm existingPatient={existingPatient} />
    </div>
  );
};

export default EditPatient;
