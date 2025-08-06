/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
    workerThreads: false,
    cpus: 1
  },
  // Reducir el consumo de memoria
  webpack: (config, { isServer }) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        vendor: {
          name: 'vendor',
          chunks: 'all',
          test: /node_modules/
        }
      }
    };
    return config;
  },
  // Generar páginas de forma incremental
  generateBuildId: async () => {
    return 'build-' + Date.now();
  }
};

module.exports = nextConfig;