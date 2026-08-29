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
    UPDATE_ROLE: (id) => `${API_BASE_URL}/users/${id}/role`,
  },
  DEPARTMENTS: {
    LIST: `${API_BASE_URL}/departments`,
  },
  STAFF: {
    LIST: `${API_BASE_URL}/staff`,
  },
  PATIENTS: {
    LIST: `${API_BASE_URL}/patients`,
    CREATE: `${API_BASE_URL}/patients`,
    BY_ID: (id) => `${API_BASE_URL}/patients/${id}`,
  },
  APPOINTMENTS: {
    LIST: `${API_BASE_URL}/appointments`,
    CREATE: `${API_BASE_URL}/appointments`,
  },
  DRUGS: {
    LIST: `${API_BASE_URL}/drugs`,
    CREATE: `${API_BASE_URL}/drugs`,
  },
  PRESCRIPTIONS: {
    LIST: `${API_BASE_URL}/prescriptions`,
  },
  LABS: {
    LIST: `${API_BASE_URL}/lab-requests`,
  },
  INVOICES: {
    LIST: `${API_BASE_URL}/invoices`,
  },
  ADMISSIONS: {
    LIST: `${API_BASE_URL}/admissions`,
  },
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "medicore_access_token",
  USER: "medicore_user",
};
