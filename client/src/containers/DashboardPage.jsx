import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Card from "../shared/Card";
import { ROLE_LABELS, ROLES } from "../constants/roles";

const MODULES = [
  { to: "/superadmin", label: "User Management", roles: [ROLES.SUPER_ADMIN] },
  {
    to: "/patients",
    label: "Patients",
    roles: [ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST],
  },
  {
    to: "/appointments",
    label: "Appointments",
    roles: [ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST],
  },
  {
    to: "/pharmacy",
    label: "Pharmacy",
    roles: [ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN, ROLES.PHARMACIST, ROLES.DOCTOR],
  },
  {
    to: "/nurses",
    label: "Nurses",
    roles: [ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN, ROLES.DEPARTMENT_HEAD, ROLES.DOCTOR, ROLES.NURSE],
  },
  {
    to: "/labs",
    label: "Laboratory",
    roles: [ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN, ROLES.DOCTOR, ROLES.LAB_TECHNICIAN],
  },
  {
    to: "/billing",
    label: "Billing",
    roles: [ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN, ROLES.BILLING_STAFF],
  },
  {
    to: "/admissions",
    label: "Admissions",
    roles: [ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST],
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const accessible = MODULES.filter(
    (m) => !m.roles || m.roles.includes(user.role)
  );

  return (
    <div className="dashboard">
      <Card title={`Welcome back, ${user.firstName}`}>
        <p>
          You are signed in as <strong>{ROLE_LABELS[user.role] || user.role}</strong>.
        </p>
        <p>Here are the modules you can access:</p>
      </Card>
      <div className="stats-grid">
        {accessible.map((m) => (
          <Link key={m.to} to={m.to} className="stat-card">
            <span className="stat-card__label">{m.label}</span>
            <span className="stat-card__arrow">&rsaquo;</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
