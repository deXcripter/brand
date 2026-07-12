import type { NextConfig } from "next";

const apiBase = (
  process.env.NEXT_PUBLIC_API_URL || ""
).replace(/\/api$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/media/:path*",
        destination: `${apiBase}/api/media/:path*`,
      },
      {
        source: "/sitemap.xml",
        destination: `${apiBase}/api/seo/sitemap.xml`,
      },
      {
        source: "/robots.txt",
        destination: `${apiBase}/api/seo/robots.txt`,
      },
    ];
  },
};

export default nextConfig;
