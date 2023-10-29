// pages\patients\[id].js
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

const PatientDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { patients } = useSelector(state => state.patients);
  const patient = patients.find(p => p._id === id);

  if (!patient) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Patient Detail</h1>
      <p>Age: {patient.age}</p>
      <p>Gender: {patient.gender}</p>
    </div>
  );
};

export default PatientDetail;
