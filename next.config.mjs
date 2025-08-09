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
    // Desactivar streaming para reducir memoria
    isrFlushToDisk: false,
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
  },
  
  // Configuración para excluir rutas del pre-renderizado
  async rewrites() {
    return {
      beforeFiles: [
        // Redirigir temporalmente páginas dinámicas a placeholder durante build
        ...(process.env.BUILDING === 'true' ? [
          {
            source: '/admin/comercios/:id',
            destination: '/temp-placeholder',
          },
          {
            source: '/admin/expedientes/:id',
            destination: '/temp-placeholder',
          },
          {
            source: '/admin/expedientes/:id/consulta',
            destination: '/temp-placeholder',
          },
          {
            source: '/admin/perritos/:id',
            destination: '/temp-placeholder',
          },
          {
            source: '/admin/seguimientos/:id',
            destination: '/temp-placeholder',
          },
          {
            source: '/admin/seguimientos/:id/nuevo',
            destination: '/temp-placeholder',
          },
          {
            source: '/admin/solicitudes/:id',
            destination: '/temp-placeholder',
          },
          {
            source: '/catalogo/:slug',
            destination: '/temp-placeholder',
          },
          {
            source: '/comercios/:slug',
            destination: '/temp-placeholder',
          },
          {
            source: '/solicitud-adopcion/:slug',
            destination: '/temp-placeholder',
          },
          {
            source: '/solicitud/:perritoId',
            destination: '/temp-placeholder',
          },
        ] : []),
      ],
    }
  },
}

export default nextConfig