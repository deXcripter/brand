import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Chronicle — The Timeline of Johnpaul Nnaji",
  },
  description:
    "The timeline of Johnpaul Nnaji's journey — milestones, projects, and the moments that shaped a software engineer's path from university to building AI-powered SEO tools.",
  openGraph: {
    title: "Chronicle — Johnpaul Nnaji",
    description:
      "The timeline of Johnpaul Nnaji's journey — milestones, projects, and moments that shaped the path.",
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
