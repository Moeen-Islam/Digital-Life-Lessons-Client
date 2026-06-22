import axios from "axios";

function cleanBaseUrl(url) {
  return String(url || "")
    .replace(/^VITE_API_URL=/, "")
    .replace(/\/+$/, "")
    .replace(/\/api\/auth$/, "")
    .replace(/\/api$/, "");
}

const fallbackBase =
  import.meta.env.PROD && typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:5000";

export const API_BASE = cleanBaseUrl(
  import.meta.env.VITE_API_URL || fallbackBase
);

export const SITE_URL =
  import.meta.env.VITE_SITE_URL ||
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:5173");

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    return Promise.reject({ ...error, friendlyMessage: message });
  }
);