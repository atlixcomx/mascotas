// Layout de servidor para configuraciones globales
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0
export const fetchCache = 'force-no-store'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'

export default function ServerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}