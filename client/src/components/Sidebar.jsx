import { NavLink } from "react-router-dom";
import { ROLES } from "../constants/roles";
import { useAuth } from "../contexts/AuthContext";

const LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: "grid", roles: null },
  {
    to: "/superadmin",
    label: "User Management",
    icon: "shield",
    roles: [ROLES.SUPER_ADMIN],
  },
  {
    to: "/patients",
    label: "Patients",
    icon: "users",
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.HOSPITAL_ADMIN,
      ROLES.DOCTOR,
      ROLES.NURSE,
      ROLES.RECEPTIONIST,
    ],
  },
  {
    to: "/appointments",
    label: "Appointments",
    icon: "calendar",
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.HOSPITAL_ADMIN,
      ROLES.DOCTOR,
      ROLES.NURSE,
      ROLES.RECEPTIONIST,
    ],
  },
  {
    to: "/pharmacy",
    label: "Pharmacy",
    icon: "drug",
    roles: [ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN, ROLES.PHARMACIST, ROLES.DOCTOR],
  },
  {
    to: "/nurses",
    label: "Nurses",
    icon: "nurse",
    roles: [ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN, ROLES.DEPARTMENT_HEAD, ROLES.DOCTOR, ROLES.NURSE],
  },
  {
    to: "/labs",
    label: "Laboratory",
    icon: "lab",
    roles: [ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN, ROLES.DOCTOR, ROLES.LAB_TECHNICIAN],
  },
  {
    to: "/billing",
    label: "Billing",
    icon: "cash",
    roles: [ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN, ROLES.BILLING_STAFF],
  },
  {
    to: "/admissions",
    label: "Admissions",
    icon: "bed",
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.HOSPITAL_ADMIN,
      ROLES.DOCTOR,
      ROLES.NURSE,
      ROLES.RECEPTIONIST,
    ],
  },
];

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role;

  const visibleLinks = LINKS.filter(
    (link) => !link.roles || link.roles.includes(role)
  );

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo">+</span>
        <span className="sidebar__name">MediCore</span>
      </div>
      <nav className="sidebar__nav" aria-label="Main navigation">
        {visibleLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? "sidebar__link is-active" : "sidebar__link"
            }
          >
            <span className="sidebar__icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
