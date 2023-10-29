// pages/appointments/AppointmentsList.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments, fetchMyAppointments, deleteAppointment } from '@/slices/appointmentSlice';
import Link from 'next/link';
import moment from 'moment-timezone';

const AppointmentsList = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const userRole = user ? user.role : null;
  const { appointments, loading, error } = useSelector(state => state.appointments);

  const handleDelete = async (id) => {
    await dispatch(deleteAppointment(id));
  };

  useEffect(() => {
    if (userRole === 'Patient' || userRole === 'Doctor') {
      dispatch(fetchMyAppointments());
    } else if (userRole === 'Admin') {
      dispatch(fetchAppointments());
    }
  }, [userRole, dispatch]);


  if (loading === 'loading') return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {/* Render list of appointments here */}
      {appointments.map((appointment, index) => {
        // Convert the UTC time from the database to South African time
        const saTime = moment.utc(appointment.scheduledTime).tz('Africa/Johannesburg').format('YYYY-MM-DD HH:mm:ss');

        return (
          <div key={index} className="p-4 border-b border-gray-200">
            {/* Direct Link without <a> tag */}
            <Link href={`/appointments/${appointment._id}`}>
              <div className="cursor-pointer hover:text-blue-600">
                <h2 className="text-xl font-semibold text-gray-800">Appointment with: {appointment.doctorId.firstName} {appointment.doctorId.lastName}</h2>
                <p className="text-gray-600">Scheduled Time: {saTime}</p> 
                <p className="text-gray-600">Status: {appointment.status}</p>
              </div>
            </Link>
            <div className="mt-2 space-x-2">
              <button onClick={() => handleDelete(appointment._id)} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">Delete</button>
              <Link href={`/appointments/edit/${appointment._id}`}>
                <button className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">Edit</button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AppointmentsList;
