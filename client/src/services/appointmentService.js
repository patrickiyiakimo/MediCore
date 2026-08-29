import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/API_ENDPOINTS";

export const appointmentService = {
  list({ limit = 20, offset = 0 } = {}) {
    return apiClient
      .get(API_ENDPOINTS.APPOINTMENTS.LIST, { params: { limit, offset } })
      .then((res) => res.data);
  },
  create(payload) {
    return apiClient
      .post(API_ENDPOINTS.APPOINTMENTS.CREATE, payload)
      .then((res) => res.data);
  },
};
