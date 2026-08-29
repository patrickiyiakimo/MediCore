import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/API_ENDPOINTS";

export const admissionService = {
  list({ limit = 20, offset = 0 } = {}) {
    return apiClient
      .get(API_ENDPOINTS.ADMISSIONS.LIST, { params: { limit, offset } })
      .then((res) => res.data);
  },
};
