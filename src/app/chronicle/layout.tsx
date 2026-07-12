import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Chronicle | Johnpaul Nnaji",
  },
  description:
    "A short timeline of school, jobs, and what I'm building now.",
  openGraph: {
    title: "Chronicle | Johnpaul Nnaji",
    description:
      "A short timeline of school, jobs, and what I'm building now.",
    type: "website",
  },
};

export default function ChronicleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
