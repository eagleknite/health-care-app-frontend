// pages\timeslots\TimeSlotForm.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateDoctorTimeSlots } from '@/slices/doctorSlice';

const TimeSlotForm = ({ doctorId, handleTimeSlot }) => {
  const dispatch = useDispatch();

  // State for form fields
  const [day, setDay] = useState("Monday");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleAddTimeSlot = () => {
    if (!start || !end) {
        alert('Please specify both start and end times.');
        return;
    }

    if (start >= end) {
        alert('Start time must be before end time.');
        return;
    }

    dispatch(updateDoctorTimeSlots({ id: doctorId, timeSlotData: { day, start, end } }));
    if (handleTimeSlot) handleTimeSlot({ day, start, end });

    // Reset the time inputs
    setStart("");
    setEnd("");
  };

  return (
    <>
      <select value={day} onChange={(e) => setDay(e.target.value)} name="day">
        <option value="Monday">Monday</option>
        <option value="Tuesday">Tuesday</option>
        <option value="Wednesday">Wednesday</option>
        <option value="Thursday">Thursday</option>
        <option value="Friday">Friday</option>
        <option value="Saturday">Saturday</option>
        <option value="Sunday">Sunday</option>
      </select>
      <input type="time" value={start} onChange={(e) => setStart(e.target.value)} name="start" required />
      <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} name="end" required />
      <button type="button" onClick={handleAddTimeSlot}>Add Time Slot</button>
    </>
  );
};

export default TimeSlotForm;

