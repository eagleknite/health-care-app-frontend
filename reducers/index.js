// reducers/index.js
import { combineReducers } from 'redux';
import authReducer from '@/slices/authSlice';
import appointmentReducer from '@/slices/appointmentSlice';
import doctorReducer from '@/slices/doctorSlice';
import patientReducer from '@/slices/patientSlice';
import notificationReducer from '@/slices/notificationSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  appointments: appointmentReducer,
  doctors: doctorReducer,
  patients: patientReducer,
  notifications: notificationReducer
});

export default rootReducer;