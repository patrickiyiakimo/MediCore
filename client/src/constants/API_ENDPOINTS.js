export const API_BASE_URL = "/api";

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  USERS: {
    LIST: `${API_BASE_URL}/users`,
  },
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "medicore_access_token",
  USER: "medicore_user",
};