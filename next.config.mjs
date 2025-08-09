/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deshabilitar completamente la generación estática
  output: 'standalone',
  
  // Configuración mínima para evitar memoria
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Sin optimizaciones que consuman memoria
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  
  // Deshabilitar source maps
  productionBrowserSourceMaps: false,
  
  // Configuración básica de imágenes
  images: {
    unoptimized: true, // IMPORTANTE: No optimizar imágenes durante build
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Sin compresión durante build
  compress: false,
  
  // Headers mínimos
  poweredByHeader: false,
  reactStrictMode: false, // Desactivar para reducir re-renders
  
  // Webpack sin optimizaciones
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    // Desactivar optimizaciones
    config.optimization.minimize = false
    config.optimization.concatenateModules = false
    config.optimization.splitChunks = false
    config.optimization.runtimeChunk = false
    
    return config
  },
  
  // Generar build ID simple
  generateBuildId: async () => {
    return 'build-' + Date.now()
  }
}

export default nextConfig