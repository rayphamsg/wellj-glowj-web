import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
      // Canonical domain is https://drinkglowj.com. Safety net; the primary
      // www -> apex redirect is configured at the hosting/DNS layer.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.drinkglowj.com" }],
        destination: "https://drinkglowj.com/:path*",
        permanent: true,
      },
      // Temporary: default-locale policy is not settled (docs/SITE_ARCHITECTURE.md).
      { source: "/", destination: "/vi", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
