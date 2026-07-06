import type { NextConfig } from "next";

const apiBase = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
).replace(/\/api$/, "");

const nextConfig: NextConfig = {
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
