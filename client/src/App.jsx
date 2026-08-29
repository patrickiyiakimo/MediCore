import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./containers/AppLayout";
import LoginPage from "./containers/LoginPage";
import RegisterPage from "./containers/RegisterPage";
import DashboardPage from "./containers/DashboardPage";
import SuperAdminPage from "./containers/SuperAdminPage";
import AppointmentsPage from "./containers/AppointmentsPage";
import PatientsPage from "./containers/PatientsPage";
import PharmacyPage from "./containers/PharmacyPage";
import NursesPage from "./containers/NursesPage";
import LabsPage from "./containers/LabsPage";
import BillingPage from "./containers/BillingPage";
import AdmissionsPage from "./containers/AdmissionsPage";
import RequireRole from "./components/RequireRole";
import { ROLES } from "./constants/roles";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/superadmin"
          element={
            <RequireRole allowed={[ROLES.SUPER_ADMIN]}>
              <SuperAdminPage />
            </RequireRole>
          }
        />
        <Route
          path="/patients"
          element={
            <RequireRole
              allowed={[ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST]}
            >
              <PatientsPage />
            </RequireRole>
          }
        />
        <Route
          path="/appointments"
          element={
            <RequireRole
              allowed={[ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST]}
            >
              <AppointmentsPage />
            </RequireRole>
          }
        />
        <Route
          path="/pharmacy"
          element={
            <RequireRole
              allowed={[ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN, ROLES.PHARMACIST, ROLES.DOCTOR]}
            >
              <PharmacyPage />
            </RequireRole>
          }
        />
        <Route
          path="/nurses"
          element={
            <RequireRole
              allowed={[ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN, ROLES.DEPARTMENT_HEAD, ROLES.DOCTOR, ROLES.NURSE]}
            >
              <NursesPage />
            </RequireRole>
          }
        />
        <Route
          path="/labs"
          element={
            <RequireRole
              allowed={[ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN, ROLES.DOCTOR, ROLES.LAB_TECHNICIAN]}
            >
              <LabsPage />
            </RequireRole>
          }
        />
        <Route
          path="/billing"
          element={
            <RequireRole
              allowed={[ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN, ROLES.BILLING_STAFF]}
            >
              <BillingPage />
            </RequireRole>
          }
        />
        <Route
          path="/admissions"
          element={
            <RequireRole
              allowed={[ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST]}
            >
              <AdmissionsPage />
            </RequireRole>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
