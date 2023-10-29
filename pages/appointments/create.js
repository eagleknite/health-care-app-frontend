// pages/appointments/create.js
import Header from '../components/common/Header';
import AppointmentForm from './AppointmentForm';

const CreateAppointment = () => {
  return (
    <div>
      <Header />
      <div className="max-w-2xl mx-auto py-10 px-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-5">Create New Appointment</h1>
        <AppointmentForm />
      </div>
    </div>
  );
};

export default CreateAppointment;

