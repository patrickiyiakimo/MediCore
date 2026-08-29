import Card from "../shared/Card";
import IsLoading from "../components/LoadingState";
import { labService } from "../services/labService";
import { useList } from "../hooks/useList";
import { formatDate } from "../utils/dateFormatter";

const STATUS_LABELS = {
  requested: "Requested",
  sample_collected: "Sample Collected",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function LabsPage() {
  const { items, isLoading, error } = useList(
    ({ limit }) => labService.list({ limit }),
    { limit: 50 }
  );

  return (
    <div className="dashboard">
      <Card title="Laboratory Requests">
        {error && <p className="text-muted">{error.message}</p>}
        <IsLoading loading={isLoading}>
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Test</th>
                <th>Priority</th>
                <th>Requested By</th>
                <th>Status</th>
                <th>Requested</th>
              </tr>
            </thead>
            <tbody>
              {items.map((l) => (
                <tr key={l.id}>
                  <td>{l.patient_first_name} {l.patient_last_name}</td>
                  <td>{l.test_name}</td>
                  <td>{l.priority || "-"}</td>
                  <td>{l.requested_by_first} {l.requested_by_last}</td>
                  <td>
                    <span className={`badge badge-${l.status}`}>
                      {STATUS_LABELS[l.status] || l.status}
                    </span>
                  </td>
                  <td>{formatDate(l.created_at)}</td>
                </tr>
              ))}
              {!isLoading && items.length === 0 && (
                <tr><td colSpan="6">No lab requests found.</td></tr>
              )}
            </tbody>
          </table>
        </IsLoading>
      </Card>
    </div>
  );
}
