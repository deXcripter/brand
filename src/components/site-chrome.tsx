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

  if (isDashboard) {
    return (
      <>
        <RouteProgress />
        {children}
      </>
    );
  }

  return (
    <div className="site">
      <RouteProgress />
      <Nav />
      {children}
      <Footer />
    </div>
  );
}
