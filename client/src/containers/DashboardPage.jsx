import { useAuth } from "../contexts/AuthContext";
import Card from "../shared/Card";
import { ROLE_LABELS } from "../constants/roles";
import IsLoading from "../components/LoadingState";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <IsLoading loading={!user}>
      <div className="dashboard">
        <Card title={`Welcome back, ${user.firstName}`}>
          <p>
            You are signed in as{" "}
            <strong>{ROLE_LABELS[user.role] || user.role}</strong>.
          </p>
          <p>Your dashboard is ready. More modules coming soon.</p>
        </Card>
      </div>
    </IsLoading>
  );
}