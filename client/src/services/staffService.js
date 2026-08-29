import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/API_ENDPOINTS";

export const staffService = {
  list({ role, limit = 50, offset = 0 } = {}) {
    return apiClient
      .get(API_ENDPOINTS.STAFF.LIST, { params: { role, limit, offset } })
      .then((res) => res.data);
  },
};
