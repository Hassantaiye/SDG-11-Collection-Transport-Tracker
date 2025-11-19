import axios from "./axiosInstance";

export const registerUser = async (userData) => {
  try {
    const res = await axios.post("/api/auth/register", userData);
    if (res.data.user?.token) {
      localStorage.setItem("token", res.data.user.token);
    }
    return res.data.user;
  } catch (error) {
    // Enhanced error throwing to preserve backend error messages
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const res = await axios.post("/api/auth/login", credentials);
    if (res.data.user?.token) {
      localStorage.setItem("token", res.data.user.token);
    }
    return res.data.user;
  } catch (error) {
    throw error;
  }
};

export const getMeApi = async () => {
  const res = await axios.get("/api/auth/me");
  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};