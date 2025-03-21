import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: "/api", // Remove hardcoded origin for proxy compatibility
  headers: {
    "Content-Type": "application/json", // Explicit JSON content type
  },
});

// Request interceptor
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {}; // Ensure headers object exists
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle token expiration
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      
      // Handle JSON parse errors
      if (error.response.headers["content-type"].indexOf("application/json") === -1) {
        return Promise.reject(new Error("Received non-JSON response"));
      }
    }
    return Promise.reject(error);
  }
);

export default api;