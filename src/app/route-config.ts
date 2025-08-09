// Configuración global para forzar renderizado dinámico
// Este archivo exporta configuraciones que pueden ser importadas en páginas
export const routeConfig = {
  dynamic: 'force-dynamic' as const,
  dynamicParams: true,
  revalidate: 0,
  fetchCache: 'force-no-store' as const,
  runtime: 'nodejs' as const,
  preferredRegion: 'auto' as const,
}