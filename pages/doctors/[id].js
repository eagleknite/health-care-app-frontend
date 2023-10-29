// pages\doctors\[id].js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleDoctor } from '@/slices/doctorSlice';
import { fetchProfile } from '@/slices/authSlice';

const DoctorDetail = ({ doctorId }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const effectiveId = id || doctorId;
  
  const { doctors } = useSelector(state => state.doctors);
  const { user } = useSelector(state => state.auth); // Assuming the fetched profile is stored here
  const doctor = doctors.find(doc => doc._id === effectiveId);

  useEffect(() => {
    if (effectiveId) {
      dispatch(fetchSingleDoctor(effectiveId));
      dispatch(fetchProfile()); // Fetch the user's profile based on the ID
    }
  }, [effectiveId, dispatch]);

  if (!doctor || !user) {
    return <p>Loading...</p>;
  } 

  return (
    <div>
      <h1>Doctor Detail</h1>
      <p>Name: {user.firstName} {user.lastName}</p>
      <p>Specialty: {doctor.specialty}</p>
      <div>
        <h3>Qualifications:</h3>
        <ul>
          {doctor.qualifications.map((qual, index) => (
            <li key={index}>
              Degree: {qual.degree}, Institution: {qual.institution}, Year: {qual.year}
            </li>
          ))}
        </ul>
      </div>

      {/* Display doctor's availability */}
      <div>
        <h3>Availability:</h3>
        <ul>
          {doctor.availability.map((daySlot, index) => (
            <li key={index}>
              {daySlot.day}: {daySlot.timeSlots.map((slot, sIndex) => (
                <span key={sIndex}>{slot.start} - {slot.end}{sIndex !== daySlot.timeSlots.length - 1 ? ', ' : ''}</span>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DoctorDetail;
