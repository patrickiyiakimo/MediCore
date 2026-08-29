import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./containers/AppLayout";
import LoginPage from "./containers/LoginPage";
import RegisterPage from "./containers/RegisterPage";
import DashboardPage from "./containers/DashboardPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}