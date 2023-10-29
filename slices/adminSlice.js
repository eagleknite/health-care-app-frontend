// slices/adminSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';  // Assuming you are using axios

// Async actions
export const fetchAllUsers = createAsyncThunk(
  'admins/fetchAllUsers',
  async () => {
    const response = await axios.get('/api/admins');
    return response.data;
  }
);

export const createAdmin = createAsyncThunk(
  'admins/createAdmin',
  async (adminData) => {
    const response = await axios.post('/api/admins', adminData);
    return response.data;
  }
);

export const updateAdmin = createAsyncThunk(
  'admins/updateAdmin',
  async ({ id, updatedData }) => {
    const response = await axios.put(`/api/admins/${id}`, updatedData);
    return response.data;
  }
);

export const deleteAdmin = createAsyncThunk(
  'admins/deleteAdmin',
  async (id) => {
    await axios.delete(`/api/admins/${id}`);
    return id;
  }
);

// Redux slice
const adminSlice = createSlice({
  name: 'admins',
  initialState: {
    users: [],
    loading: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = 'succeeded';
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateAdmin.fulfilled, (state, action) => {
        const index = state.users.findIndex(admin => admin._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        const index = state.users.findIndex(admin => admin._id === action.payload);
        if (index !== -1) {
          state.users.splice(index, 1);
        }
      });
  }
});

export default adminSlice.reducer;
