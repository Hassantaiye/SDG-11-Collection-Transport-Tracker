import axios from "axios";

// Normalize API base URL to avoid double `/api/api` issues
let base = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Remove trailing slash
base = base.replace(/\/$/, "");

// If env accidentally ends with /api, strip it
if (base.toLowerCase().endsWith("/api")) {
  base = base.slice(0, -4);
}

const axiosInstance = axios.create({
  baseURL: base,
});

// Attach token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response error handler (recommended)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired or invalid → logout user safely
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
