import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
       const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
        return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      toast.error("Session expired. Please login again.");

      window.location.href = "/login";
    } else {
      toast.error(
        error.response?.data?.error || "Something went wrong"
      );
    }

    return Promise.reject(error);
  }
);

export default api;