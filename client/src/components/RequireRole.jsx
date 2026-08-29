import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RequireRole({ allowed, children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess = Array.isArray(allowed) && allowed.includes(user.role);
  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
