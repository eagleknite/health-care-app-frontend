// pages\appointments\AppointmentForm.js
import React, { useState, useEffect, useMemo } from 'react'; // added useMemo
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { createSelector } from 'reselect';
import { createAppointment, updateAppointment } from '@/slices/appointmentSlice';
import { fetchDoctors } from '@/slices/doctorSlice';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment-timezone';
import Header from '../components/common/Header';

const AppointmentForm = ({ existingAppointment }) => {
  const loggedInUser = useSelector(state => state.auth.user);
  const doctors = useSelector(state => state.doctors.doctors);
  const [startDate, setStartDate] = useState(new Date());
  const dispatch = useDispatch();
  const router = useRouter();
  const getAppointments = state => state.appointments.appointments;

  // console.log('doctors from Redux:', doctors); 
 
  const [formData, setFormData] = useState(existingAppointment || {
    doctorId: '',
    patientId: loggedInUser && loggedInUser.role === 'Patient' ? loggedInUser.id : '',
    scheduledTime: '',
    status: 'Scheduled',
    notes: ''
  });

  useEffect(() => {
    if (existingAppointment) {
      setFormData(existingAppointment);
    }
  }, [existingAppointment]);

  useEffect(() => {
    if (!existingAppointment) {
      dispatch(fetchDoctors());
    }
  }, [dispatch, existingAppointment]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // console.log('Appointment formData:', formData); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log('Submitting with scheduledTime:', formData.scheduledTime);
    
    if (existingAppointment) {
      await dispatch(updateAppointment({ id: existingAppointment._id, updatedData: formData }));
    } else {
      await dispatch(createAppointment(formData));
    }
    router.push('/appointments'); // Navigate to appointments page after operation
  };

  // Fetch booked appointments for the selected date (assuming it's in Redux)
  const getBookedAppointments = createSelector(
    [getAppointments, (_, startDate) => startDate],
    (appointments, startDate) => appointments.filter(
        appt => new Date(appt.scheduledTime).toDateString() === startDate.toDateString()
    )
  );

  const bookedAppointments = useSelector(state => getBookedAppointments(state, startDate));

  // console.log('bookedAppointments:', bookedAppointments);

  // Fetch doctor's availability based on the selected doctor from the form
  const selectedDoctor = doctors.find(doctor => doctor._id === formData.doctorId);
  const selectedDoctorAvailability = selectedDoctor ? selectedDoctor.availability : [];

  const availableTimeSlots = useMemo(() => {
    const selectedDay = moment(startDate).format('dddd');
    
    if (!Array.isArray(selectedDoctorAvailability)) {
      return [];
    }

    const dayAvailability = selectedDoctorAvailability.find(day => day.day === selectedDay);

    // console.log('dayAvailability:', dayAvailability);

    if (!dayAvailability) return [];

    return dayAvailability.timeSlots.filter(slot => {
      const slotStart = new Date(`${startDate.toISOString().split('T')[0]}T${slot.start}`);
      return !bookedAppointments.some(appt => new Date(appt.scheduledTime).getTime() === slotStart.getTime());
    });
  }, [startDate, selectedDoctorAvailability, bookedAppointments]);

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto py-10 px-6 bg-white shadow rounded space-y-6">
      <div>
        <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">Doctor:</label>
        <select
          id="doctorId"
          name="doctorId"
          value={formData.doctorId}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
        >
          <option value="">Select a Doctor</option>
          {doctors.map(doctor => (
            <option key={doctor._id} value={doctor._id}>
              Dr. {doctor.firstName} {doctor.lastName} ({doctor.specialty})
            </option>
          ))}
        </select>
      </div>
      {loggedInUser && loggedInUser.role !== 'Patient' && (
        <div>
          <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">Patient ID:</label>
          <input 
            type="text" 
            id="patientId" 
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
      )}
      <div>
        <label htmlFor="date">Date:</label>
        <DatePicker 
          selected={startDate}
          onChange={date => setStartDate(date)}
          dateFormat="yyyy-MM-dd"
          inline
        />
      </div>
      <div>
        <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700">Time Slot:</label>
        <select 
          id="timeSlot" 
          name="scheduledTime"
          value={formData.scheduledTime.split('T')[1]}
          onChange={e => setFormData({ ...formData, scheduledTime: `${startDate.toISOString().split('T')[0]}T${e.target.value}`})}
        >
          {availableTimeSlots.map(slot => (
            <option key={`${slot.start}-${slot.end}`} value={`${slot.start}`}>{`${slot.start} - ${slot.end}`}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="status">Status:</label>
        <select 
          id="status" 
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes:</label>
        <textarea 
          id="notes" 
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1 h-32"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full">Save</button>
    </form>
  );
};

export default AppointmentForm;
