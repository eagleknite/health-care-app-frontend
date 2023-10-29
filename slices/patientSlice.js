// slices/patientSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async () => {
    const response = await axios.get('https://health-care-app-backend.onrender.com/api/patients');
    return response.data;
  }
);

export const fetchSinglePatient = createAsyncThunk(
  'patients/fetchSinglePatient',
  async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`https://health-care-app-backend.onrender.com/api/patients/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}` // Pass token in header
        }
      }); // Remove leading '/'
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const createPatient = createAsyncThunk(
  'patients/createPatient',
  async (patientData) => {
    const response = await axios.post('https://health-care-app-backend.onrender.com/api/patients', patientData);
    return response.data;
  }
);

export const updatePatient = createAsyncThunk(
  'patients/updatePatient',
  async ({ id, updatedData }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.put(`https://health-care-app-backend.onrender.com/api/patients/${id}`, updatedData, {
        headers: {
          'Authorization': `Bearer ${token}` // Pass token in header
        }
      }); // Remove leading '/'
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const deletePatient = createAsyncThunk(
  'patients/deletePatient',
  async (id) => {
    await axios.delete(`https://health-care-app-backend.onrender.com/api/patients/${id}`);
    return id;
  }
);

const patientSlice = createSlice({
  name: 'patients',
  initialState: {
    patients: [],
    loading: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.patients = action.payload;
        state.loading = 'succeeded';
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchSinglePatient.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(fetchSinglePatient.fulfilled, (state, action) => {
        const index = state.patients.findIndex(patient => patient._id === action.payload._id);
        if (index !== -1) {
          state.patients[index] = action.payload;
        } else {
          state.patients.push(action.payload);
        }
        state.loading = 'succeeded';
      })
      .addCase(fetchSinglePatient.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.patients.push(action.payload);
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        const index = state.patients.findIndex(patient => patient._id === action.payload._id);
        if (index !== -1) {
          state.patients[index] = action.payload;
        }
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        const index = state.patients.findIndex(patient => patient._id === action.payload);
        if (index !== -1) {
          state.patients.splice(index, 1);
        }
      });
  }
});

export default patientSlice.reducer;
