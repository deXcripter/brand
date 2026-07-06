"use client";

import { useLayoutEffect, useState } from "react";
import { checkSession } from "@/lib/auth";

export default function DashboardAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [allowed, setAllowed] = useState(false);

  useLayoutEffect(() => {
    checkSession().then((ok) => {
      if (!ok) {
        const next = encodeURIComponent(
          window.location.pathname + window.location.search
        );
        window.location.replace(`/dashboard/login?next=${next}`);
        return;
      }

      setAllowed(true);
    });
  }, []);

  if (!allowed) {
    return null;
  }

  return children;
}
