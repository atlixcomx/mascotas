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
  
  // Configuración experimental para evitar pre-renderizado
  experimental: {
    workerThreads: false,
    cpus: 1,
    // Forzar solo renderizado en servidor
    serverComponents: true,
    // Desactivar streaming para reducir memoria
    isrFlushToDisk: false,
    // Reducir paralelismo
    workerThreads: false,
    // Desactivar características nuevas
    instrumentationHook: false,
    turbotrace: {
      logLevel: 'error',
      logDetail: false,
      contextDirectory: process.cwd(),
    },
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