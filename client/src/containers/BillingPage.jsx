import Card from "../shared/Card";
import IsLoading from "../components/LoadingState";
import { billingService } from "../services/billingService";
import { useList } from "../hooks/useList";
import { formatDate } from "../utils/dateFormatter";

const STATUS_LABELS = {
  draft: "Draft",
  issued: "Issued",
  partially_paid: "Partially Paid",
  paid: "Paid",
  voided: "Voided",
};

const formatMoney = (v) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(v) || 0);

export default function BillingPage() {
  const { items, isLoading, error } = useList(
    ({ limit }) => billingService.list({ limit }),
    { limit: 50 }
  );

  return (
    <div className="dashboard">
      <Card title="Invoices / Billing">
        {error && <p className="text-muted">{error.message}</p>}
        <IsLoading loading={isLoading}>
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Subtotal</th>
                <th>Discount</th>
                <th>Tax</th>
                <th>Total</th>
                <th>Status</th>
                <th>Issued</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td>{i.patient_first_name} {i.patient_last_name}</td>
                  <td>{formatMoney(i.subtotal)}</td>
                  <td>{formatMoney(i.discount)}</td>
                  <td>{formatMoney(i.tax)}</td>
                  <td><strong>{formatMoney(i.total)}</strong></td>
                  <td>
                    <span className={`badge badge-${i.status}`}>
                      {STATUS_LABELS[i.status] || i.status}
                    </span>
                  </td>
                  <td>{formatDate(i.created_at)}</td>
                </tr>
              ))}
              {!isLoading && items.length === 0 && (
                <tr><td colSpan="7">No invoices found.</td></tr>
              )}
            </tbody>
          </table>
        </IsLoading>
      </Card>
    </div>
  );
}
