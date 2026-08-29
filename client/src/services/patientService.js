import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/API_ENDPOINTS";

export const patientService = {
  list({ limit = 20, offset = 0 } = {}) {
    return apiClient
      .get(API_ENDPOINTS.PATIENTS.LIST, { params: { limit, offset } })
      .then((res) => res.data);
  },
  create(payload) {
    return apiClient
      .post(API_ENDPOINTS.PATIENTS.CREATE, payload)
      .then((res) => res.data);
  },
  byId(id) {
    return apiClient.get(API_ENDPOINTS.PATIENTS.BY_ID(id)).then((res) => res.data);
  },
};
