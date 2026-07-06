"use client";

import { usePathname } from "next/navigation";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboard ? <Nav /> : null}
      {children}
      {!isDashboard ? <Footer /> : null}
    </>
  );
}
