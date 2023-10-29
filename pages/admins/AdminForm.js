// pages\admins\AdminForm.js
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { createAdmin, updateAdmin } from '@/slices/adminSlice';

const AdminForm = ({ existingAdmin }) => {
  const [formData, setFormData] = useState(existingAdmin || {
    managedDoctors: [],
    managedPatients: []
  });
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (existingAdmin) {
      setFormData(existingAdmin);
    }
  }, [existingAdmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.split(',') });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (existingAdmin) {
      await dispatch(updateAdmin({ id: existingAdmin._id, updatedData: formData }));
    } else {
      await dispatch(createAdmin(formData));
    }
    router.push('/admins'); // Navigate to admin page after operation
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Add your form fields here */}
      <button type="submit">Save</button>
    </form>
  );
};

export default AdminForm;
