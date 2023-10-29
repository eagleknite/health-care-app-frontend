// pages\doctors\DoctorForm.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { createDoctor, updateDoctor } from '@/slices/doctorSlice';

const DoctorForm = ({ existingDoctor }) => {
  const defaultDoctor = {
    specialty: '',
    qualifications: [],
    timeSlots: [],
  };

  const initialData = existingDoctor ? { ...existingDoctor,qualifications: existingDoctor.qualifications || [] } : defaultDoctor;

  const [formData, setFormData] = useState(initialData);
  const dispatch = useDispatch();
  const router = useRouter();
  const [editing, setEditing] = useState(null);  // This hold { dayIndex, slotIndex } if editing, null otherwise


  // State for time slots
  const [day, setDay] = useState("Monday");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  if (!existingDoctor) {
    return <p>Loading...</p>;
  }

  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    if (existingDoctor) {
      setFormData({
        ...existingDoctor,
        qualifications: existingDoctor.qualifications || [],
      });
    }
  }, [existingDoctor]);

  const handleAddTimeSlot = () => {
    if (!start || !end) {
        alert('Please specify both start and end times.');
        return;
    }

    if (start >= end) {
        alert('Start time must be before end time.');
        return;
    }

    setFormData(prevState => {
      let availabilityCopy = JSON.parse(JSON.stringify(prevState.availability));

      if (editing) { // If in edit mode
        // Directly update the time slot being edited
        availabilityCopy[editing.dayIndex].timeSlots[editing.slotIndex] = { start, end };
      } else { // If in add mode
        let dayExists = availabilityCopy.some(item => item.day === day);
        if (dayExists) {
          let dayIndex = availabilityCopy.findIndex(item => item.day === day);

          // Check for exact duplicate slots
          const duplicateSlot = availabilityCopy[dayIndex].timeSlots.some(slot => slot.start === start && slot.end === end);
          if (duplicateSlot) {
              alert(`Time slot duplicates an existing slot for ${day}`);
              return prevState;
          }

          availabilityCopy[dayIndex].timeSlots.push({ start, end });
        } else {
          availabilityCopy.push({
            day,
            timeSlots: [{ start, end }]
          });
        }
      }
      
      return {
        ...prevState,
        availability: availabilityCopy
      };
    });

    // Reset the time inputs and editing mode
    setStart("");
    setEnd("");
    setEditing(null); // Reset editing mode
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleQualificationChange = (e, index) => {
    const { name, value } = e.target;
    const newQualifications = [...formData.qualifications];
    newQualifications[index][name] = value;
    setFormData({ ...formData, qualifications: newQualifications });
  };

  const handleAddQualification = () => {
    setFormData({
      ...formData,
      qualifications: [...formData.qualifications, { degree: '', institution: '', year: '' }]
    });
  };

  const handleRemoveTimeSlot = (dayIndex, slotIndex) => {
    // Create a deep copy of the availability
    let availabilityCopy = JSON.parse(JSON.stringify(formData.availability));

    console.log("Original availability:", formData.availability);
    console.log("Day Index:", dayIndex, "Slot Index:", slotIndex);

    // Check if the day exists
    if (!availabilityCopy[dayIndex]) {
      console.error(`Error: No availability found for day index ${dayIndex}`);
      return;
    }

    // Check if timeSlots array exists for the day
    if (!availabilityCopy[dayIndex].timeSlots) {
      console.error(`Error: No time slots found for day index ${dayIndex}`);
      return;
    }

    // Check if the specific time slot exists
    if (!availabilityCopy[dayIndex].timeSlots[slotIndex]) {
      console.error(`Error: No time slot found for slot index ${slotIndex} on day index ${dayIndex}`);
      return;
    }

    // Remove the time slot
    availabilityCopy[dayIndex].timeSlots.splice(slotIndex, 1);

    // If no time slots remain for the day, remove the entire day.
    if (availabilityCopy[dayIndex].timeSlots.length === 0) {
      availabilityCopy.splice(dayIndex, 1);
    }

    // Update the form data
    setFormData(prevState => ({
      ...prevState,
      availability: availabilityCopy
    }));

    // The API call and related logic have been removed.
  };

  // Handle editing of time slots
  const handleEditTimeSlot = (dayIndex, slotIndex) => {
    const selectedDay = formData.availability[dayIndex];
    const selectedSlot = selectedDay.timeSlots[slotIndex];
    setDay(selectedDay.day);
    setStart(selectedSlot.start);
    setEnd(selectedSlot.end);
    setEditing({ dayIndex, slotIndex });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mergedData = {
      ...formData,
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    };
    if (existingDoctor) {
      await dispatch(updateDoctor({ id: existingDoctor._id, updatedData: mergedData }));
    } else {
      await dispatch(createDoctor(mergedData));
    }
    router.push('/doctors'); // Navigate to doctors page after operation
};

  return (
     <form onSubmit={handleSubmit} className="space-y-4 container mx-auto p-6 bg-white shadow-md mt-6 rounded">
      <div className="space-y-2">
        <label htmlFor="specialty" className="block text-sm font-medium text-gray-600">Specialty:</label>
        <input 
          type="text" 
          id="specialty" 
          name="specialty"
          value={formData.specialty}
          onChange={handleChange}
          className="p-2 border rounded"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-600">Qualifications:</label>
        {formData.qualifications && formData.qualifications.map((qual, index) => (
          <div key={index} className="space-y-2">
            <input 
              type="text" 
              name="degree"
              placeholder="Degree"
              value={qual.degree}
              onChange={(e) => handleQualificationChange(e, index)}
              className="p-2 border rounded"
            />
            <input 
              type="text" 
              name="institution"
              placeholder="Institution"
              value={qual.institution}
              onChange={(e) => handleQualificationChange(e, index)}
              className="p-2 border rounded"
            />
            <input 
              type="number" 
              name="year"
              placeholder="Year"
              value={qual.year}
              onChange={(e) => handleQualificationChange(e, index)}
              className="p-2 border rounded"
            />
          </div>
        ))}
        <button type="button" onClick={handleAddQualification} className="text-blue-500">Add Qualification</button>
      </div>
       <h3 className="text-sm font-medium text-gray-600">Time Slots</h3>
      
      {formData.availability && formData.availability.map((daySlot, dayIndex) => (
        daySlot.timeSlots.map((slot, slotIndex) => (
          <div key={`${dayIndex}-${slotIndex}`}>
            {daySlot.day} {slot.start} - {slot.end} 
            <button type="button" onClick={() => handleRemoveTimeSlot(dayIndex, slotIndex)}>Remove</button>
            <button type="button" onClick={() => handleEditTimeSlot(dayIndex, slotIndex)}>Edit</button>
          </div>
        ))
      ))}

      <div className="space-y-2">
        <select value={day} onChange={(e) => setDay(e.target.value)} name="day">
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>
        <input type="time" value={start} onChange={(e) => setStart(e.target.value)} name="start" />
        <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} name="end" />
        <button type="button" onClick={handleAddTimeSlot}>Add Time Slot</button>
      </div>

      <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Save</button>
    </form>
  );
};

export default DoctorForm;
