import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  trailingSlash: true,
  turbopack: {
    root: process.cwd(),
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/privacy",
        destination: "https://www.caredirect.com/privacy/",
        permanent: true,
      },
      {
        source: "/privacy/",
        destination: "https://www.caredirect.com/privacy/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
