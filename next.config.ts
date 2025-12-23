import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only use standalone for production builds
  ...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),
};

export default nextConfig;
