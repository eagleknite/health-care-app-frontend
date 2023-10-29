// pages\appointments\[id].js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import EditAppointment from './edit/[id]';
import Header from '../components/common/Header';

const AppointmentDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { appointments } = useSelector(state => state.appointments);
  const appointment = appointments.find(app => app._id === id);

  const [isEditing, setIsEditing] = useState(false);

  if (!appointment) {
    return <p>Loading...</p>;
  }

  if (isEditing) {
    return <EditAppointment />;
  }

  return (
    <div>
      <Header />
      <div className="max-w-2xl mx-auto py-10 px-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-5">Appointment Detail</h1>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Doctor:</h2>
          <p>{appointment.doctorId.firstName} {appointment.doctorId.lastName}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Patient:</h2>
          <p>{appointment.patientId.firstName} {appointment.patientId.lastName}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Scheduled Time:</h2>
          <p>{new Date(appointment.scheduledTime).toLocaleString()}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Status:</h2>
          <p>{appointment.status}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Notes:</h2>
          <p>{appointment.notes}</p>
        </div>
        <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Edit Appointment</button>
      </div>
    </div>
  );
};

export default AppointmentDetail;
