import { NavLink } from "react-router-dom";
import { ROLES } from "../constants/roles";
import { useAuth } from "../contexts/AuthContext";

const ADMIN_ROLES = [ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN];

const LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: "grid" },
  { to: "/patients", label: "Patients", icon: "users", adminOnly: true },
  { to: "/appointments", label: "Appointments", icon: "calendar" },
];

export default function Sidebar() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.includes(user?.role);

  const visibleLinks = LINKS.filter(
    (link) => !link.adminOnly || isAdmin
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
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}