import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/API_ENDPOINTS";

export const userService = {
  listUsers({ limit = 20, offset = 0 } = {}) {
    return apiClient.get(API_ENDPOINTS.USERS.LIST, {
      params: { limit, offset },
    }).then((res) => res.data);
  },
  updateRole(id, role) {
    return apiClient
      .patch(API_ENDPOINTS.USERS.UPDATE_ROLE(id), { role })
      .then((res) => res.data);
  },
};
