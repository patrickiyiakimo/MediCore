import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/API_ENDPOINTS";

export const authService = {
  register(payload) {
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, payload);
  },

  login(credentials) {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },

  logout() {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  refresh() {
    return apiClient.post(API_ENDPOINTS.AUTH.REFRESH);
  },
};