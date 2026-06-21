import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const SITE_URL = import.meta.env.VITE_SITE_URL || "http://localhost:5173";

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject({ ...error, friendlyMessage: message });
  }
);
