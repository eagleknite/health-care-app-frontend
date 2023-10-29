// slices\notificationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';  
import { getAuthConfig } from '../utils/authUtils';

// Async Thunk action to fetch notifications
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { getState }) => {
    try {
      const response = await axios.get('https://health-care-app-backend.onrender.com/api/notifications/all', getAuthConfig(getState));

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

// Async Thunk action to create a new notification
export const createNotification = createAsyncThunk(
  'notifications/createNotification',
  async (notificationData, { getState }) => {
    try {
      const response = await axios.post('https://health-care-app-backend.onrender.com/api/notifications', notificationData, getAuthConfig(getState));

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

// Async Thunk action to update a notification
export const updateNotification = createAsyncThunk(
  'notifications/updateNotification',
  async ({ id, updatedData }, { getState }) => {
    try {
      const response = await axios.put(`https://health-care-app-backend.onrender.com/api/notifications/${id}/update`, updatedData, getAuthConfig(getState));

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

// Async Thunk action to mark a notification as read
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id, { getState }) => {
    try {
      const response = await axios.put(`https://health-care-app-backend.onrender.com/api/notifications/${id}/read`, {}, getAuthConfig(getState));

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

// Async Thunk action to mark all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { getState }) => {
    try {
      const response = await axios.put('https://health-care-app-backend.onrender.com/api/notifications/all/read', {}, getAuthConfig(getState));

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

// Async Thunk action to delete a notification
export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (id, { getState }) => {
    try {
      const response = await axios.delete(`https://health-care-app-backend.onrender.com/notifications/${id}/delete`, getAuthConfig(getState));

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
      return id;
    } catch (error) {
      throw error.response && error.response.data && error.response.data.message ? 
            new Error(error.response.data.message) : 
            error;
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    loading: 'idle',
    error: null
  },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.loading = 'succeeded';
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      })
      .addCase(createNotification.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.notifications.push(action.payload);
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateNotification.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(updateNotification.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(notification => notification._id === action.payload._id);
        if (index !== -1) {
          state.notifications[index] = action.payload;
        }
      })
      .addCase(updateNotification.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      })
      .addCase(markNotificationAsRead.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(notification => notification._id === action.payload._id);
        if (index !== -1) {
          state.notifications[index].isRead = true;
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteNotification.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(notification => notification._id === action.payload);
        if (index !== -1) {
          state.notifications.splice(index, 1);
        }
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      });
  }
});

export default notificationSlice.reducer;
