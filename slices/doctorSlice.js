// slices/doctorSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';  // Assuming you are using axios

// Async actions
export const fetchDoctors = createAsyncThunk(
  'doctors/fetchDoctors',
  async () => {
    const response = await axios.get('https://health-care-app-backend.onrender.com/api/doctors'); 
    return response.data;
  }
)

export const fetchSingleDoctor = createAsyncThunk(
  'doctors/fetchSingleDoctor',
  async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
    
      const response = await axios.get(`https://health-care-app-backend.onrender.com/api/doctors/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`  // Pass token in header
        }
      }); // Remove leading '/'
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
)

export const createDoctor = createAsyncThunk(
  'doctors/createDoctor',
  async (doctorData) => {
    const response = await axios.post('https://health-care-app-backend.onrender.com/api/doctors', doctorData); 
    return response.data;
  }
);

export const updateDoctor = createAsyncThunk(
  'doctors/updateDoctor',
  async ({ id, updatedData }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
    
      const response = await axios.put(`https://health-care-app-backend.onrender.com/api/doctors/${id}`, updatedData, {
        headers: {
          'Authorization': `Bearer ${token}`  // Pass token in header
        }
      }); // Remove leading '/'
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const deleteDoctor = createAsyncThunk(
  'doctors/deleteDoctor',
  async (id) => {
    await axios.delete(`https://health-care-app-backend.onrender.com/api/doctors/${id}`);
    return id;
  }
);

// Redux slice
const doctorSlice = createSlice({
  name: 'doctors',
  initialState: {
    doctors: [],
    loading: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.doctors = action.payload;
        state.loading = 'succeeded';
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchSingleDoctor.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(fetchSingleDoctor.fulfilled, (state, action) => {
        const index = state.doctors.findIndex(doc => doc._id === action.payload._id);
        if (index !== -1) {
          state.doctors[index] = action.payload;
        } else {
          state.doctors.push(action.payload);
        }
        state.loading = 'succeeded';
      })
      .addCase(fetchSingleDoctor.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      })
      .addCase(createDoctor.fulfilled, (state, action) => {
        state.doctors.push(action.payload);
      })
      .addCase(updateDoctor.fulfilled, (state, action) => {
        const index = state.doctors.findIndex(doc => doc._id === action.payload._id);
        if (index !== -1) {
          state.doctors[index] = action.payload;
        }
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        const index = state.doctors.findIndex(doc => doc._id === action.payload);
        if (index !== -1) {
          state.doctors.splice(index, 1);
        }
      });
  }
});

export default doctorSlice.reducer;


/*// update doctor time slots
export const updateDoctorTimeSlots = createAsyncThunk(
  'doctors/updateDoctorTimeSlots',
  async ({ id, timeSlotData }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
    
      const response = await axios.put(`http://localhost:5000/api/doctors/${id}/timeSlots`, timeSlotData, {
        headers: {
          'Authorization': `Bearer ${token}`  // Pass token in header
        }
      }); // Remove leading '/'
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

.addCase(updateDoctorTimeSlots.fulfilled, (state, action) => {
        const index = state.doctors.findIndex(doc => doc._id === action.payload._id);
        if (index !== -1) {
          state.doctors[index] = action.payload;
        }
      });
*/