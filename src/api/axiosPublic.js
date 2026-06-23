import axios from "axios";

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
});

axiosPublic.interceptors.request.use((config) => {
  const token = localStorage.getItem("scaffold-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosPublic;