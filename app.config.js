// Configuración global para forzar renderizado dinámico
module.exports = {
  // Forzar todas las páginas a ser dinámicas
  experimental: {
    dynamicIO: true,
    ppr: false,
  },
  // Desactivar pre-rendering
  generateStaticParams: false,
}