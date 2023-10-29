// pages/appointments/index.js
import React from 'react';
import Link from 'next/link';
import Header from '../components/common/Header';
import AppointmentsList from './AppointmentsList';

const AppointmentsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-6 bg-white shadow-md mt-6 rounded">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">All Appointments</h1>
        <Link href="/appointments/create">
          <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Create New Appointment</button>
        </Link>
        <AppointmentsList />
      </div>
    </div>
  );
};

export default AppointmentsPage;



