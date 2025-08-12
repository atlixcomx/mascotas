import dynamic from 'next/dynamic';
import Footer from './Footer';

// Importar el nuevo header moderno con lazy loading para mejor performance
const ModernHeader = dynamic(() => import('./modern/ModernHeader'), {
  ssr: true,
  loading: () => <div style={{ height: '72px' }} /> // Placeholder mientras carga
});

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f8f8f8',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <ModernHeader />
      <main style={{ 
        flex: 1,
        paddingTop: '72px' // Compensar por el header fixed
      }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}