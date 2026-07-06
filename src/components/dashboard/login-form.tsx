"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { checkSession, login } from "@/lib/auth";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkSession().then((ok) => {
      if (ok) {
        router.replace(searchParams.get("next") || "/dashboard");
      }
    });
  }, [router, searchParams]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
    } catch {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    setLoading(false);

    const next = searchParams.get("next") || "/dashboard";
    router.push(next);
    router.refresh();
  }

  return (
    <form className="dashboard-login__form" onSubmit={onSubmit}>
      <label className="dashboard-field">
        <span className="dashboard-field__label mono">Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
      </label>
      <label className="dashboard-field">
        <span className="dashboard-field__label mono">Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />
      </label>
      {error ? <p className="dashboard-login__error">{error}</p> : null}
      <button type="submit" className="btn btn--primary" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
