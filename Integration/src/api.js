import axios from "axios";

export const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://online-exam-app-bbxu.onrender.com/api";

// Long timeout: the free Render tier can take 30-50s to wake from idle.
const api = axios.create({ baseURL: BASE_URL, timeout: 70000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (e) => {
    const url = e.config?.url || "";
    if (
      e.response?.status === 401 &&
      !url.startsWith("/auth/login") &&
      !url.startsWith("/auth/register")
    ) {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("auth:expired"));
    }
    return Promise.reject(e);
  },
);

// Every success response is { success, message, data }. Resolve to { data, message }.
export const unwrap = (promise) => promise.then((r) => r.data.data);
export const errMsg = (e) =>
  e.response?.data?.message ||
  (e.code === "ECONNABORTED"
    ? "The server took too long to respond. Please try again."
    : e.message) ||
  "Something went wrong";

export const readLS = (k) => {
  try {
    return JSON.parse(localStorage.getItem(k));
  } catch {
    return null;
  }
};
export default api;
