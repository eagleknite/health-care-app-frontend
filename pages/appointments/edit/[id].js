// pages/appointments/edit/[id].js
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import AppointmentForm from '../AppointmentForm';
import Header from '../../components/common/Header';

const EditAppointment = () => {
  const router = useRouter();
  const { id } = router.query;
  const { appointments } = useSelector(state => state.appointments);
  const appointment = appointments.find(app => app._id === id);

  if (!appointment) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Header />
      <div className="max-w-2xl mx-auto py-10 px-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-5">Edit Appointment</h1>
        <AppointmentForm existingAppointment={appointment} />
      </div>
    </div>
  );
};

export default EditAppointment;
