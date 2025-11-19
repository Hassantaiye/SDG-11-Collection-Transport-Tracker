import axios from "axios";

// Normalize VITE_API_URL so frontend code that calls endpoints like `/api/admin/...`
// doesn't accidentally produce `.../api/api/...` if the env already contains `/api`.
let base = import.meta.env.VITE_API_URL || "http://localhost:5000";
base = base.replace(/\/$/, ""); // remove trailing slash
if (base.toLowerCase().endsWith("/api")) {
  base = base.slice(0, -4); // strip trailing '/api' to avoid double-prefixing
}

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

// Attach JWT token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // token saved on login
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;
