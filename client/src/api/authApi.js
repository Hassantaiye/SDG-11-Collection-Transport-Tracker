import axios from "./axiosInstance";

export const registerUser = async (userData) => {
  const res = await axios.post("/api/auth/register", userData);
  if (res.data.user?.token) localStorage.setItem("token", res.data.user.token);
  return res.data.user;
};

export const loginUser = async (credentials) => {
  const res = await axios.post("/api/auth/login", credentials);
  if (res.data.user?.token) localStorage.setItem("token", res.data.user.token);
  return res.data.user;
};

export const getMeApi = async () => {
  const res = await axios.get("/api/auth/me");
  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};
