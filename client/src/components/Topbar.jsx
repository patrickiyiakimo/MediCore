import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "../shared/Button";
import { ROLE_LABELS } from "../constants/roles";

export default function Topbar({ user }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div className="topbar__user">
        <span className="topbar__name">
          {user.firstName} {user.lastName}
        </span>
        <span className="topbar__role">
          {ROLE_LABELS[user.role] || user.role}
        </span>
      </div>
      <Button variant="ghost" onClick={handleLogout}>
        Log out
      </Button>
    </header>
  );
}