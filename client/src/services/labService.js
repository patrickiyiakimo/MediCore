import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/API_ENDPOINTS";

export const labService = {
  list({ status, limit = 20, offset = 0 } = {}) {
    return apiClient
      .get(API_ENDPOINTS.LABS.LIST, { params: { status, limit, offset } })
      .then((res) => res.data);
  },
};
