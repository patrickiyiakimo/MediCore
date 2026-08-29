import Card from "../shared/Card";
import IsLoading from "../components/LoadingState";
import { staffService } from "../services/staffService";
import { useList } from "../hooks/useList";
import { ROLE_LABELS } from "../constants/roles";

export default function NursesPage() {
  const nurses = useList(
    ({ limit }) => staffService.list({ role: "nurse", limit }),
    { limit: 50 }
  );

  return (
    <div className="dashboard">
      <Card title="Nursing Staff">
        <IsLoading loading={nurses.isLoading}>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Specialization</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {nurses.items.map((n) => (
                <tr key={n.id}>
                  <td>{n.first_name} {n.last_name}</td>
                  <td>{n.email}</td>
                  <td>{n.specialization || "-"}</td>
                  <td>{n.department_name || "-"}</td>
                  <td>
                    <span className="badge">{ROLE_LABELS[n.role] || n.role}</span>
                  </td>
                </tr>
              ))}
              {!nurses.isLoading && nurses.items.length === 0 && (
                <tr><td colSpan="5">No nurses found.</td></tr>
              )}
            </tbody>
          </table>
        </IsLoading>
      </Card>
    </div>
  );
}
