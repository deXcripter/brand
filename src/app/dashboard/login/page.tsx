import { Suspense } from "react";
import LoginForm from "@/components/dashboard/login-form";

export default function DashboardLoginPage() {
  return (
    <div className="dashboard-login">
      <div className="dashboard-login__card">
        <p className="eyebrow mono">// dashboard</p>
        <h1 className="dashboard-login__title">Sign in</h1>
        <p className="dashboard-muted">
          Manage blog posts and gallery images.
        </p>
        <Suspense fallback={<p className="dashboard-muted">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
