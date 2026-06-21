// frontend/src/services/reviewApi.js

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// submit a new review for a product
export const submitReview = async (productId, review, rating) => {
  const response = await API.post("/reviews", { productId, review, rating });
  return response.data;
};

// get all reviews for a specific product
export const getProductReviews = async (productId) => {
  const response = await API.get(`/reviews/${productId}`);
  return response.data;
};