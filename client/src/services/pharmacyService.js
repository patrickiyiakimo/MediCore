import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/API_ENDPOINTS";

export const pharmacyService = {
  listDrugs({ search, limit = 50, offset = 0 } = {}) {
    return apiClient
      .get(API_ENDPOINTS.DRUGS.LIST, { params: { search, limit, offset } })
      .then((res) => res.data);
  },
  createDrug(payload) {
    return apiClient
      .post(API_ENDPOINTS.DRUGS.CREATE, payload)
      .then((res) => res.data);
  },
  listPrescriptions({ limit = 20, offset = 0 } = {}) {
    return apiClient
      .get(API_ENDPOINTS.PRESCRIPTIONS.LIST, { params: { limit, offset } })
      .then((res) => res.data);
  },
};
