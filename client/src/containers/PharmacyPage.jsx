import { useState } from "react";
import Card from "../shared/Card";
import IsLoading from "../components/LoadingState";
import { pharmacyService } from "../services/pharmacyService";
import { useList } from "../hooks/useList";
import { formatDate } from "../utils/dateFormatter";

const PRESCRIPTION_STATUS = {
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function PharmacyPage() {
  const drugs = useList(
    ({ limit }) => pharmacyService.listDrugs({ limit }),
    { limit: 50 }
  );
  const prescriptions = useList(
    ({ limit }) => pharmacyService.listPrescriptions({ limit }),
    { limit: 20 }
  );

  return (
    <div className="dashboard">
      <Card title="Drug Inventory">
        <IsLoading loading={drugs.isLoading}>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Generic</th>
                <th>Category</th>
                <th>Unit</th>
                <th>Reorder Level</th>
              </tr>
            </thead>
            <tbody>
              {drugs.items.map((d) => (
                <tr key={d.id}>
                  <td>{d.name}</td>
                  <td>{d.generic_name || "-"}</td>
                  <td>{d.category || "-"}</td>
                  <td>{d.unit || "-"}</td>
                  <td>{d.reorder_level}</td>
                </tr>
              ))}
              {!drugs.isLoading && drugs.items.length === 0 && (
                <tr><td colSpan="5">No drugs found.</td></tr>
              )}
            </tbody>
          </table>
        </IsLoading>
      </Card>

      <Card title="Prescriptions">
        <IsLoading loading={prescriptions.isLoading}>
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Items</th>
                <th>Status</th>
                <th>Issued</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.items.map((pr) => (
                <tr key={pr.id}>
                  <td>{pr.patient_first_name} {pr.patient_last_name}</td>
                  <td>{pr.doctor_first_name} {pr.doctor_last_name}</td>
                  <td>
                    {Array.isArray(pr.items) && pr.items.length > 0
                      ? pr.items.map((it) => it.name).join(", ")
                      : "-"}
                  </td>
                  <td>
                    <span className={`badge badge-${pr.status}`}>
                      {PRESCRIPTION_STATUS[pr.status] || pr.status}
                    </span>
                  </td>
                  <td>{formatDate(pr.created_at)}</td>
                </tr>
              ))}
              {!prescriptions.isLoading && prescriptions.items.length === 0 && (
                <tr><td colSpan="5">No prescriptions found.</td></tr>
              )}
            </tbody>
          </table>
        </IsLoading>
      </Card>
    </div>
  );
}
