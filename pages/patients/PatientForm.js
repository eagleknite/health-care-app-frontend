// pages\patients\PatientForm.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { createPatient, updatePatient } from '@/slices/patientSlice';

const PatientForm = ({ existingPatient }) => {
  const [formData, setFormData] = useState(existingPatient || {
    age: '',
    gender: 'Male',
    medicalHistory: []
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    if (existingPatient) {
      setFormData({
        ...existingPatient,
        medicalHistory: existingPatient.medicalHistory || [],
      });
    }
  }, [existingPatient]);


  if (!existingPatient) {
    return <p>Loading...</p>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleHistoryChange = (e, index) => {
    const { name, value } = e.target;
    const newHistory = [...formData.medicalHistory];
    newHistory[index][name] = value;
    setFormData({ ...formData, medicalHistory: newHistory });
  };

  const addMedicalHistory = () => {
    setFormData({
      ...formData,
      medicalHistory: [...formData.medicalHistory, { condition: '', treatment: '', notes: '' }]
    });
  };

  const removeMedicalHistory = (index) => {
    const newHistory = [...formData.medicalHistory];
    newHistory.splice(index, 1);
    setFormData({ ...formData, medicalHistory: newHistory });
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
    if (existingPatient) {
      await dispatch(updatePatient({ id: existingPatient._id, updatedData: mergedData }));
    } else {
      await dispatch(createPatient(mergedData));
    }
    router.push('/patients');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 container mx-auto p-6 bg-white shadow-md mt-6 rounded">
      <div className="space-y-2">
        <label htmlFor="age" className="block text-sm font-medium text-gray-600">Age:</label>
        <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} className="p-2 border rounded" />
      </div>
      <div className="space-y-2">
        <label htmlFor="gender" className="block text-sm font-medium text-gray-600">Gender:</label>
        <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="p-2 border border-gray-300 rounded w-full">
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-600">Medical History:</label>
        {formData.medicalHistory && formData.medicalHistory.map((item, index) => (
          <div key={index} className="space-y-2">
            <input
              type="text"
              name="condition"
              placeholder="Condition"
              value={item.condition}
              onChange={(e) => handleHistoryChange(e, index)}
              className="p-2 border border-gray-300 rounded w-full"
            />
            <input
              type="text"
              name="treatment"
              placeholder="Treatment"
              value={item.treatment}
              onChange={(e) => handleHistoryChange(e, index)}
              className="p-2 border border-gray-300 rounded w-full"
            />
            <input
              type="text"
              name="notes"
              placeholder="Notes"
              value={item.notes}
              onChange={(e) => handleHistoryChange(e, index)}
              className="p-2 border border-gray-300 rounded w-full"
            />
            <button type="button" onClick={() => removeMedicalHistory(index)} className="text-red-500">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addMedicalHistory} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full">Add Medical History</button>
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full">Save</button>
    </form>
  );
};

export default PatientForm;

