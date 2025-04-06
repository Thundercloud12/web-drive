// src/utils/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:4300/api/v1',
  withCredentials: true,
});

// Optional: Add JWT token from localStorage (if you're storing it)
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers["Authorization"] = token;
  return config;
});

export default instance;
