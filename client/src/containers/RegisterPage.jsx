import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Input from "../shared/Input";
import Button from "../shared/Button";
import Alert from "../shared/Alert";
import { isValidEmail, isValidPhoneNumber } from "../utils/validation";

export default function RegisterPage() {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const setField = (key) => (event) => {
    setForm({ ...form, [key]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!isValidEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!isValidPhoneNumber(form.phoneNumber)) {
      setError("Please enter a valid phone number.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const result = await register(form);
    if (result.success) {
      navigate("/login");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-card__title">Create your account</h1>
        <Alert variant="error">{error}</Alert>
        <Input
          label="First name"
          value={form.firstName}
          onChange={setField("firstName")}
          required
        />
        <Input
          label="Last name"
          value={form.lastName}
          onChange={setField("lastName")}
          required
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={setField("email")}
          required
        />
        <Input
          label="Phone number"
          value={form.phoneNumber}
          onChange={setField("phoneNumber")}
          required
        />
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={setField("password")}
          helper="Minimum 8 characters"
          required
        />
        <Input
          label="Confirm password"
          type="password"
          value={form.confirmPassword}
          onChange={setField("confirmPassword")}
          required
        />
        <Button type="submit" loading={isLoading}>
          Create account
        </Button>
      </form>
    </div>
  );
}