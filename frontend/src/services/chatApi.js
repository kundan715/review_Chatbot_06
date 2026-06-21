// frontend/src/services/chatApi.js

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// i attach token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// send question to backend, get ai answer back
export const askQuestion = async (productId, question) => {
  const response = await API.post("/chat/ask", { productId, question });
  return response.data;
};

// get all past chats for logged in user
export const getChatHistory = async () => {
  const response = await API.get("/chat/history");
  return response.data;
};

// delete a specific chat by id
export const deleteChat = async (chatId) => {
  const response = await API.delete(`/chat/history/${chatId}`);
  return response.data;
};