import type { NextConfig } from "next";

const apiBase = (
  process.env.NEXT_PUBLIC_API_URL || ""
).replace(/\/api$/, "");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/sitemaps.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/media/:path*",
        destination: `${apiBase}/api/media/:path*`,
      },
    ];
  },
};

export default nextConfig;
