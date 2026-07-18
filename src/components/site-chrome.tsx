"use client";

import { usePathname } from "next/navigation";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import RouteProgress from "@/components/route-progress";
import Pwd from "@/components/pwd";

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const isDashboardApp =
    isDashboard && !pathname.startsWith("/dashboard/login");

  return (
    <>
      <RouteProgress />
      {/* Only show the floating breadcrumb Pwd on dashboard pages */}
      {isDashboardApp && (
        <Pwd className="pwd--fixed pwd--dashboard" />
      )}
      {isDashboard ? (
        children
      ) : (
        <div className="site">
          <Nav />
          {children}
          <Footer />
        </div>
      )}
    </>
  );
}
