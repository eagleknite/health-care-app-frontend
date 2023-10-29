// slices/appointmentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';  // Assuming you are using axios
import { getAuthConfig } from '../utils/authUtils';

// Async Thunk action to fetch appointments
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (_, { getState }) => {
    try {
      const response = await axios.get('https://health-care-app-backend.onrender.com/api/appointments', getAuthConfig(getState));
      
      if (response.data.error) {
        // Handle specific error codes differently
        switch (response.data.code) {
          case 404:
            throw new Error("The resource you're trying to access was not found.");
          case 500:
            throw new Error("There's a problem on our end. Please try again later.");
          default:
            throw new Error(response.data.message);
        }
      }
      
      return response.data;
    } catch (error) {
      throw error.response && error.response.data && error.response.data.message ? 
            new Error(error.response.data.message) : 
            error;
    }
  }
);

export const fetchMyAppointments = createAsyncThunk(
  'appointments/fetchMyAppointments',
  async (_, { getState }) => {
    try {
      const userId = getState().auth.user.id;
      // console.log('Fetch my appointments userId:', userId);
      const response = await axios.get(`https://health-care-app-backend.onrender.com/api/appointments/${userId}/myAppointments`, getAuthConfig(getState));
      
      if (response.data.error) {
        // Handle specific error codes differently
        switch (response.data.code) {
          case 404:
            throw new Error("The resource you're trying to access was not found.");
          case 500:
            throw new Error("There's a problem on our end. Please try again later.");
          default:
            throw new Error(response.data.message);
        }
      }
      
      return response.data;
    } catch (error) {
      throw error.response && error.response.data && error.response.data.message ? 
            new Error(error.response.data.message) : 
            error;
    }
  }
);

// Async Thunk action to create a new appointment
export const createAppointment = createAsyncThunk(
  'appointments/createAppointment',
  async (appointmentData, { getState }) => {
    try {
      const response = await axios.post('https://health-care-app-backend.onrender.com/api/appointments/book', appointmentData, getAuthConfig(getState));
      
      if (response.data.error) {
        // Handle specific error codes differently
        switch (response.data.code) {
          case 404:
            throw new Error("The resource you're trying to access was not found.");
          case 500:
            throw new Error("There's a problem on our end. Please try again later.");
          default:
            throw new Error(response.data.message);
        }
      }
      
      return response.data;
    } catch (error) {
      throw error.response && error.response.data && error.response.data.message ? 
            new Error(error.response.data.message) : 
            error;
    }
  }
);

// Async Thunk action to update an appointment
export const updateAppointment = createAsyncThunk(
  'appointments/updateAppointment',
  async ({ id, updatedData }, { getState }) => {
    try {
      const response = await axios.put(`https://health-care-app-backend.onrender.com/api/appointments/${id}`, updatedData, getAuthConfig(getState));
      
      if (response.data.error) {
        // Handle specific error codes differently
        switch (response.data.code) {
          case 404:
            throw new Error("The resource you're trying to access was not found.");
          case 500:
            throw new Error("There's a problem on our end. Please try again later.");
          default:
            throw new Error(response.data.message);
        }
      }
      
      return response.data;
    } catch (error) {
      throw error.response && error.response.data && error.response.data.message ? 
            new Error(error.response.data.message) : 
            error;
    }
  }
);

// Async Thunk action to delete an appointment
export const deleteAppointment = createAsyncThunk(
  'appointments/deleteAppointment',
  async (id, { getState }) => {
    try {
      const response = await axios.delete(`https://health-care-app-backend.onrender.com/api/appointments/${id}`, getAuthConfig(getState));
      
      if (response.data.error) {
        // Handle specific error codes differently
        switch (response.data.code) {
          case 404:
            throw new Error("The resource you're trying to access was not found.");
          case 500:
            throw new Error("There's a problem on our end. Please try again later.");
          default:
            throw new Error(response.data.message);
        }
      }
      
      return response.data;
    } catch (error) {
      throw error.response && error.response.data && error.response.data.message ? 
            new Error(error.response.data.message) : 
            error;
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: {
    appointments: [],
    loading: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload;
        state.loading = 'succeeded';
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchMyAppointments.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(fetchMyAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload;
        state.loading = 'succeeded';
      })
      .addCase(fetchMyAppointments.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.appointments.push(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(app => app._id === action.payload._id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(app => app._id === action.payload);
        if (index !== -1) {
          state.appointments.splice(index, 1);
        }
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
      state.loading = 'failed';
      state.error = action.error.message;
    });
  }
});

export default appointmentSlice.reducer;

