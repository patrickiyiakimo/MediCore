import Card from "../shared/Card";
import IsLoading from "../components/LoadingState";
import { appointmentService } from "../services/appointmentService";
import { useList } from "../hooks/useList";
import { formatDateTime } from "../utils/dateFormatter";

const STATUS_LABELS = {
  scheduled: "Scheduled",
  confirmed: "Confirmed",
  checked_in: "Checked in",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No show",
};

export default function AppointmentsPage() {
  const { items, isLoading, error } = useList(
    ({ limit }) => appointmentService.list({ limit }),
    { limit: 50 }
  );

  return (
    <div className="dashboard">
      <Card title="Appointments">
        {error && <p className="text-muted">{error.message}</p>}
        <IsLoading loading={isLoading}>
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Reason</th>
                <th>Scheduled</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id}>
                  <td>{a.patient_first_name} {a.patient_last_name}</td>
                  <td>{a.doctor_first_name} {a.doctor_last_name}</td>
                  <td>{a.department_name || "-"}</td>
                  <td>{a.reason || "-"}</td>
                  <td>{formatDateTime(a.scheduled_at)}</td>
                  <td>
                    <span className={`badge badge-${a.status}`}>
                      {STATUS_LABELS[a.status] || a.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!isLoading && items.length === 0 && (
                <tr><td colSpan="6">No appointments found.</td></tr>
              )}
            </tbody>
          </table>
        </IsLoading>
      </Card>
    </div>
  );
}
