import axios from "axios";
import { API_ENDPOINTS } from "../constants/API_ENDPOINTS";

const apiClient = axios.create({
  baseURL: "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url.includes("/auth/refresh")
    ) {
      original._retry = true;
      try {
        await apiClient.post(API_ENDPOINTS.AUTH.REFRESH);
        return apiClient(original);
      } catch {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;