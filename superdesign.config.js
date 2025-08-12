module.exports = {
  // Configuración para Superdesign Canvas
  name: 'Centro de Adopción Atlixco',
  description: 'Sitio web del Centro de Adopción de Perritos de Atlixco, Puebla',
  
  // URLs de previsualización
  preview: {
    local: 'http://localhost:3000',
    production: 'https://atlixco-adopcion.vercel.app'
  },
  
  // Configuración de páginas principales
  pages: {
    home: {
      path: '/',
      title: 'Inicio - Centro de Adopción Atlixco',
      description: 'Encuentra tu compañero perfecto en el Centro de Adopción de Atlixco'
    },
    catalog: {
      path: '/catalogo',
      title: 'Catálogo de Perritos - Centro de Adopción Atlixco',
      description: 'Explora nuestros perritos disponibles para adopción'
    },
    adoption: {
      path: '/solicitud-adopcion',
      title: 'Solicitud de Adopción - Centro de Adopción Atlixco',
      description: 'Formulario para solicitar la adopción de un perrito'
    },
    businesses: {
      path: '/comercios-friendly',
      title: 'Comercios Pet Friendly - Atlixco',
      description: 'Descubre comercios amigables con mascotas en Atlixco'
    },
    admin: {
      path: '/admin',
      title: 'Panel de Administración - Centro de Adopción Atlixco',
      description: 'Panel de administración del Centro de Adopción'
    }
  },
  
  // Configuración de componentes principales
  components: {
    header: {
      path: 'src/components/layout/Header.tsx',
      description: 'Header principal del sitio'
    },
    footer: {
      path: 'src/components/layout/Footer.tsx',
      description: 'Footer del sitio'
    },
    perritoCard: {
      path: 'src/components/ui/PerritoCard.tsx',
      description: 'Tarjeta de perrito para el catálogo'
    },
    adoptionForm: {
      path: 'src/components/forms/AdoptionForm.tsx',
      description: 'Formulario de adopción'
    },
    searchBar: {
      path: 'src/components/search/SearchBar.tsx',
      description: 'Barra de búsqueda'
    }
  },
  
  // Configuración de estilos
  styles: {
    primary: '#af1731', // Rojo Puebla
    secondary: '#840f31', // Rojo oscuro Puebla
    accent: '#c79b66', // Dorado Puebla
    background: '#ffffff',
    text: '#0e312d'
  },
  
  // Configuración de assets
  assets: {
    images: 'public/',
    icons: 'src/components/icons/',
    fonts: 'https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap'
  },
  
  // Configuración de desarrollo
  development: {
    port: 3000,
    host: 'localhost',
    api: 'http://localhost:3000/api'
  }
}
