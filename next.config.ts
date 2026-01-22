import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Skip build-time database connections
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  // Handle build issues
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("@prisma/client");
    }
    return config;
  },
};

export default nextConfig;
