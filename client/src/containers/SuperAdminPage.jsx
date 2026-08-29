import { useState } from "react";
import Card from "../shared/Card";
import Alert from "../shared/Alert";
import Button from "../shared/Button";
import IsLoading from "../components/LoadingState";
import { useUsers } from "../hooks/useUsers";
import { userService } from "../services/userService";
import { ROLE_LABELS, ROLES } from "../constants/roles";
import { getErrorMessage, getValidationErrors } from "../utils/errorParser";

const ROLE_OPTIONS = Object.keys(ROLES).map((key) => ({
  value: ROLES[key],
  label: ROLE_LABELS[ROLES[key]],
}));

export default function SuperAdminPage() {
  const { users, isLoading, reload } = useUsers({ limit: 50 });
  const [updatingId, setUpdatingId] = useState(null);
  const [notice, setNotice] = useState({ type: null, message: "" });

  const handleRoleChange = async (userId, role) => {
    setUpdatingId(userId);
    setNotice({ type: null, message: "" });
    try {
      await userService.updateRole(userId, role);
      setNotice({ type: "success", message: "User role updated successfully." });
      reload();
    } catch (err) {
      setNotice({
        type: "error",
        message:
          Object.values(getValidationErrors(err))[0] || getErrorMessage(err),
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="dashboard">
      <Card title="System Users">
        <Alert variant={notice.type || "info"}>{notice.message}</Alert>
        <IsLoading loading={isLoading}>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    {user.first_name} {user.last_name}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      className="field__input table__select"
                      value={user.role}
                      disabled={updatingId === user.id}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    >
                      {ROLE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {updatingId === user.id && (
                      <Button variant="ghost" loading>
                        Saving
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {!isLoading && users.length === 0 && (
                <tr>
                  <td colSpan="4">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </IsLoading>
      </Card>
    </div>
  );
}
