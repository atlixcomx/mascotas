import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  // Forzar modo standalone para evitar generación estática
  output: 'standalone'
};

export default nextConfig;
