"use client";

import { usePathname } from "next/navigation";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import RouteProgress from "@/components/route-progress";

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <>
      <RouteProgress />
      {!isDashboard ? <Nav /> : null}
      {children}
      {!isDashboard ? <Footer /> : null}
    </>
  );
}
