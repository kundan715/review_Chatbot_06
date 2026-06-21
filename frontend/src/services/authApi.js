// frontend/src/services/authApi.js

import axios from "axios";

// i set base url here so i only change one place if backend url changes
const API = axios.create({
  baseURL: "http://localhost:5000",
});

// attach jwt token to every request automatically
// i dont want to manually add token in every component
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// register new user
export const registerUser = async (name, email, password) => {
  const response = await API.post("/auth/register", { name, email, password });
  return response.data;
};

// login existing user
export const loginUser = async (email, password) => {
  const response = await API.post("/auth/login", { email, password });
  return response.data;
};