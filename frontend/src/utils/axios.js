import axios from 'axios';
import  store  from "../store/store";
import { logout } from '../slices/authSlice';

const instance = axios.create({
  baseURL: "https://web-drive-ir4q.onrender.com/api/v1",
  withCredentials: true,
});


instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
}, (error) => {
  return Promise.reject(error);
});


instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
  
      store.dispatch(logout());

      localStorage.removeItem("token");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default instance;
