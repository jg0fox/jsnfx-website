import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/portfolio/netflix",
        destination: "/projects/netflix",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
