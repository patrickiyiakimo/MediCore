import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/API_ENDPOINTS";

export const billingService = {
  list({ limit = 20, offset = 0 } = {}) {
    return apiClient
      .get(API_ENDPOINTS.INVOICES.LIST, { params: { limit, offset } })
      .then((res) => res.data);
  },
};
