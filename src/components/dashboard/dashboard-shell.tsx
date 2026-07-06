"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/auth";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/posts", label: "Blog posts" },
  { href: "/dashboard/gallery", label: "Gallery" },
];

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/dashboard/login");
    router.refresh();
  }

  return (
    <div className="dashboard">
      <aside className="dashboard__sidebar">
        <div className="dashboard__brand">
          <Link href="/dashboard" className="mono">
            // dashboard
          </Link>
          <Link href="/" className="dashboard__back mono">
            ← site
          </Link>
        </div>
        <nav className="dashboard__nav" aria-label="Dashboard">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href ||
                (link.href !== "/dashboard" && pathname.startsWith(link.href))
                  ? "is-active"
                  : ""
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button type="button" className="dashboard__logout" onClick={handleLogout}>
          Sign out
        </button>
      </aside>
      <main className="dashboard__main">{children}</main>
    </div>
  );
}
