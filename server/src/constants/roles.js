/**
 * Application roles used for role-based access control (RBAC).
 */
const ROLES = {
  SUPER_ADMIN: "super_admin",
  HOSPITAL_ADMIN: "hospital_admin",
  DEPARTMENT_HEAD: "department_head",
  DOCTOR: "doctor",
  NURSE: "nurse",
  PHARMACIST: "pharmacist",
  LAB_TECHNICIAN: "lab_technician",
  RECEPTIONIST: "receptionist",
  BILLING_STAFF: "billing_staff",
};

module.exports = ROLES;
