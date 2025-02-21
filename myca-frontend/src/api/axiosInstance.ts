// src/api/axiosInstance.ts
import axios from "axios";
import { BASE_URL } from "../config";  // Ensure the correct relative path

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Interceptor to attach token, etc.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
