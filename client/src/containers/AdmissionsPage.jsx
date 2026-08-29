import Card from "../shared/Card";
import IsLoading from "../components/LoadingState";
import { admissionService } from "../services/admissionService";
import { useList } from "../hooks/useList";
import { formatDateTime } from "../utils/dateFormatter";

const STATUS_LABELS = {
  admitted: "Admitted",
  discharged: "Discharged",
  transferred: "Transferred",
};

export default function AdmissionsPage() {
  const { items, isLoading, error } = useList(
    ({ limit }) => admissionService.list({ limit }),
    { limit: 50 }
  );

  return (
    <div className="dashboard">
      <Card title="Admissions / Ward">
        {error && <p className="text-muted">{error.message}</p>}
        <IsLoading loading={isLoading}>
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Room</th>
                <th>Type</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Admitted</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id}>
                  <td>{a.patient_first_name} {a.patient_last_name}</td>
                  <td>{a.room_number || "-"}</td>
                  <td>{a.room_type || "-"}</td>
                  <td>{a.reason || "-"}</td>
                  <td>
                    <span className={`badge badge-${a.status}`}>
                      {STATUS_LABELS[a.status] || a.status}
                    </span>
                  </td>
                  <td>{formatDateTime(a.admitted_at)}</td>
                </tr>
              ))}
              {!isLoading && items.length === 0 && (
                <tr><td colSpan="6">No admissions found.</td></tr>
              )}
            </tbody>
          </table>
        </IsLoading>
      </Card>
    </div>
  );
}
