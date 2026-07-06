import type { ApiError } from "@/lib/types";

export function getApiUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }
  const url = base + "/api";
  return url.replace(/\/$/, "");
}

export function redirectToLogin(): void {
  if (typeof window === "undefined") return;
  const next = encodeURIComponent(
    window.location.pathname + window.location.search
  );
  window.location.replace(`/dashboard/login?next=${next}`);
}

type ApiFetchOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { auth, headers, ...rest } = options;
  const requestHeaders = new Headers(headers);

  if (
    rest.body &&
    !(rest.body instanceof FormData) &&
    !requestHeaders.has("Content-Type")
  ) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(`${getApiUrl()}${path}`, {
    ...rest,
    headers: requestHeaders,
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401 && auth) {
      redirectToLogin();
      throw new Error("Not authenticated");
    }

    let message = `Request failed (${response.status})`;
    try {
      const data = (await response.json()) as ApiError;
      if (data.error) message = data.error;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function serverApiFetch<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${getApiUrl()}${path}`, {
      next: { revalidate: 10 },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}
