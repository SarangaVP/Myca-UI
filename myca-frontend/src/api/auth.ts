// src/api/auth.ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
// const API_BASE_URL = "http://localhost:8000";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const loginUser = async (data: LoginData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/login`, data);
    return response.data;
  } catch (error) {
    const axiosError = error as any;
    throw new Error(axiosError.response?.data?.message || "Login request failed");
  }
};

export const registerUser = async (data: RegisterData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/register`, data);
    return response.data;
  } catch (error) {
    const axiosError = error as any;
    throw new Error(axiosError.response?.data?.message || "Registration request failed");
  }
};


