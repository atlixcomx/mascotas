/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración MÍNIMA para build de emergencia
  output: 'export',
  
  // Deshabilitar TODO
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Desactivar generación estática
  generateStaticParams: false,
  
  // Sin optimizaciones
  images: {
    unoptimized: true,
  },
  
  // Sin análisis
  productionBrowserSourceMaps: false,
  
  // Sin compresión
  compress: false,
  
  // Headers mínimos
  poweredByHeader: false,
  
  // Webpack sin optimizaciones
  webpack: (config) => {
    config.optimization = {
      minimize: false,
      concatenateModules: false,
      splitChunks: false,
      runtimeChunk: false,
    }
    return config
  },
}

export default nextConfig