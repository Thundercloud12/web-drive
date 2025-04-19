// src/utils/axios.js
import axios from 'axios';
import  store  from "../store/store";
import { logout } from '../slices/authSlice';

const instance = axios.create({
  baseURL: 'http://localhost:4300/api/v1',
  withCredentials: true,
});

// ✅ Attach token from localStorage
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ✅ Handle token expiration globally
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      // Dispatch logout action to Redux
      store.dispatch(logout());

      // Clear localStorage token
      localStorage.removeItem("token");

      // Redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default instance;
