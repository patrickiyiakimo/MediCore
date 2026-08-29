import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/API_ENDPOINTS";

export const departmentService = {
  list() {
    return apiClient
      .get(API_ENDPOINTS.DEPARTMENTS.LIST)
      .then((res) => res.data);
  },
};
