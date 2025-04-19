import { configureStore } from '@reduxjs/toolkit';
import signupReducer from '../slices/signUpSlice.js';
import authReducer from "../slices/authSlice.js"

const store = configureStore({
  reducer: {
    signup: signupReducer,
    auth: authReducer
  },
});

export default store;
