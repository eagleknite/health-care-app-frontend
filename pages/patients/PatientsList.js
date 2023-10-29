// // pages\patients\PatientsList.js
// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchPatients, deletePatient } from '@/slices/patientSlice';
// import Link from 'next/link';

// const PatientsList = () => {
//   const dispatch = useDispatch();
//   const { patients, loading, error } = useSelector(state => state.patients);
  
//   useEffect(() => {
//     dispatch(fetchPatients());
//   }, []);
  
//   const handleDelete = async (id) => {
//     await dispatch(deletePatient(id));
//   };


// };

// export default PatientsList;
