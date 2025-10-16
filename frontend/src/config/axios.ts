import axios, { type InternalAxiosRequestConfig, type AxiosError } from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // set to true if using cookies
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      if ((config.headers as any)?.set) {
        (config.headers as any).set("Authorization", `Bearer ${token}`);
      } else {
        config.headers = {
          ...(config.headers ?? {}),
          Authorization: `Bearer ${token}`,
        } as any;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = (error.response as any)?.status;
    if (status === 401) {
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    } else if (status === 403) {
      console.warn("Forbidden: insufficient permissions");
    } else if (!error.response && (error as any).request) {
      console.error("Network error:", (error as any).request);
    } else if (error.message) {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
