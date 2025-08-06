/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig;