// slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Asynchronous thunk action for registration
export const register = createAsyncThunk('auth/register', async (user) => {
  const response = await axios.post('https://health-care-app-backend.onrender.com/auth/register', user);
  localStorage.setItem('token', response.data.data.token);
  localStorage.setItem('refreshToken', response.data.data.refreshToken);
  return response.data;
});

export const login = createAsyncThunk('auth/login', async (user) => {
  const response = await axios.post('https://health-care-app-backend.onrender.com/auth/login', user);
  localStorage.setItem('token', response.data.data.token);
  localStorage.setItem('refreshToken', response.data.data.refreshToken);
  // console.log("Stored Token:", localStorage.getItem('token'));
  // console.log("Stored Refresh Token:", localStorage.getItem('refreshToken'));
  // thunkAPI.dispatch(fetchProfile());  // Dispatch fetchProfile here
  return response.data.data;
});


export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, { dispatch }) => {
  try {
    const token = localStorage.getItem('token');  // Retrieve token
    const refreshToken = localStorage.getItem('refreshToken');  // Retrieve refresh token
    // console.log("Token from localStorage:", token);
    // console.log("Refresh token from localStorage:", refreshToken);
    if (!token) {
      // console.error("Token not found in localStorage");
      return;
    }
    const response = await axios.get('https://health-care-app-backend.onrender.com/auth/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`  // Pass token in header

      }
    });
    // console.log("Profile Data Received:", response.data); 
    return response.data.data;
  } catch (error) {
    if (error.response && error.response.status === 419) {
      // Handle token expiration logic, maybe fetch a new token using the refresh token
      
    } else {
      throw error;
    }
  }
});

// slices/authSlice.js

export const refreshAccessToken = createAsyncThunk('auth/refreshToken', async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await axios.post('https://health-care-app-backend.onrender.com/auth/token', { token: refreshToken });
  localStorage.setItem('token', response.data.accessToken);
  return response.data.accessToken;
});


export const logoutUser = createAsyncThunk('auth/logout', async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await axios.post('https://health-care-app-backend.onrender.com/auth/logout', { token: refreshToken });
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    status: 'idle',
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');  // Remove token
      localStorage.removeItem('refreshToken');  // Remove refresh token
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.status = 'succeeded';
        localStorage.setItem('token', action.payload.token);  // Store token
        localStorage.setItem('refreshToken', action.payload.refreshToken); 
      })
      .addCase(register.pending, (state) => {
        state.status = 'pending';
      })
        .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.status = 'succeeded';
        localStorage.setItem('token', action.payload.token);  // Store token
        localStorage.setItem('refreshToken', action.payload.refreshToken);  // Store refresh token
      })
      .addCase(login.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        localStorage.removeItem('token');  // Remove access token
        localStorage.removeItem('refreshToken');  // Remove refresh token
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        
        state.user = action.payload.user; 
        state.status = 'succeeded';
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        // console.log("Refreshed access token:", action.payload);
      });
      
  }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
