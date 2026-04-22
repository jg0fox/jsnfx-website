import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/portfolio/netflix",
        destination: "/projects/netflix",
        permanent: true,
      },
      {
        source: "/AI-workshop",
        destination: "/ai-workshop",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
