import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Skip build-time database connections
  serverExternalPackages: ["@prisma/client"],
  // Handle build issues with Turbopack
  turbopack: {},
};

export default nextConfig;
