import { useState } from "react";
import Card from "../shared/Card";
import Input from "../shared/Input";
import Button from "../shared/Button";
import Alert from "../shared/Alert";
import IsLoading from "../components/LoadingState";
import { patientService } from "../services/patientService";
import { useList } from "../hooks/useList";
import { formatDate } from "../utils/dateFormatter";
import { getErrorMessage, getValidationErrors } from "../utils/errorParser";

const EMPTY = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  bloodGroup: "",
  genotype: "",
  address: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
};

export default function PatientsPage() {
  const { items, isLoading, reload } = useList(
    ({ limit }) => patientService.list({ limit }),
    { limit: 50 }
  );
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState({ type: null, message: "" });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setNotice({ type: null, message: "" });
    try {
      await patientService.create({
        ...form,
        dateOfBirth: form.dateOfBirth || null,
        gender: form.gender || null,
        bloodGroup: form.bloodGroup || null,
        genotype: form.genotype || null,
      });
      setNotice({ type: "success", message: "Patient registered successfully." });
      setForm(EMPTY);
      reload();
    } catch (err) {
      setNotice({
        type: "error",
        message: Object.values(getValidationErrors(err))[0] || getErrorMessage(err),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard">
      <Card title="Register Patient">
        <Alert variant={notice.type || "info"}>{notice.message}</Alert>
        <form onSubmit={handleSubmit} className="form-grid">
          <Input label="First Name" value={form.firstName} onChange={set("firstName")} required />
          <Input label="Last Name" value={form.lastName} onChange={set("lastName")} required />
          <Input label="Date of Birth" type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} />
          <Input label="Gender" value={form.gender} onChange={set("gender")} placeholder="male / female / other" />
          <Input label="Blood Group" value={form.bloodGroup} onChange={set("bloodGroup")} placeholder="A+ / O- / ..." />
          <Input label="Genotype" value={form.genotype} onChange={set("genotype")} />
          <Input label="Address" value={form.address} onChange={set("address")} />
          <Input label="Emergency Contact Name" value={form.emergencyContactName} onChange={set("emergencyContactName")} />
          <Input label="Emergency Contact Phone" value={form.emergencyContactPhone} onChange={set("emergencyContactPhone")} />
          <div>
            <Button type="submit" loading={submitting}>
              Register Patient
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Patients">
        <IsLoading loading={isLoading}>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>DOB</th>
                <th>Gender</th>
                <th>Blood</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>{p.first_name} {p.last_name}</td>
                  <td>{formatDate(p.date_of_birth)}</td>
                  <td>{p.gender || "-"}</td>
                  <td>{p.blood_group || "-"}</td>
                  <td>{p.emergency_contact_phone || "-"}</td>
                </tr>
              ))}
              {!isLoading && items.length === 0 && (
                <tr><td colSpan="5">No patients found.</td></tr>
              )}
            </tbody>
          </table>
        </IsLoading>
      </Card>
    </div>
  );
}
