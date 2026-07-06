import { apiFetch, redirectToLogin } from "@/lib/api-client";

export async function checkSession(): Promise<boolean> {
  try {
    await apiFetch("/auth/me");
    return true;
  } catch {
    return false;
  }
}

export async function login(email: string, password: string): Promise<void> {
  await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout(): Promise<void> {
  try {
    await apiFetch<void>("/auth/logout", { method: "POST" });
  } catch {
    // ignore logout errors
  }
}

export { redirectToLogin };
