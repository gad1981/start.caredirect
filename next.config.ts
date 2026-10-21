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
      { source: "/baby", destination: "/newborn/", permanent: true },
      { source: "/baby/", destination: "/newborn/", permanent: true },
      {
        source: "/:locale(el|ro|sr|bg)/baby",
        destination: "/:locale/newborn/",
        permanent: true,
      },
      {
        source: "/:locale(el|ro|sr|bg)/baby/",
        destination: "/:locale/newborn/",
        permanent: true,
      },
      { source: "/luxury", destination: "/newbornluxury/", permanent: true },
      { source: "/luxury/", destination: "/newbornluxury/", permanent: true },
      {
        source: "/:locale(el|ro|sr|bg)/luxury",
        destination: "/:locale/newbornluxury/",
        permanent: true,
      },
      {
        source: "/:locale(el|ro|sr|bg)/luxury/",
        destination: "/:locale/newbornluxury/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
