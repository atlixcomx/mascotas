import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Colores Puebla
    'bg-puebla-50', 'bg-puebla-100', 'bg-puebla-200', 'bg-puebla-300', 'bg-puebla-400', 
    'bg-puebla-500', 'bg-puebla-600', 'bg-puebla-700', 'bg-puebla-800', 'bg-puebla-900',
    'text-puebla-50', 'text-puebla-100', 'text-puebla-200', 'text-puebla-300', 'text-puebla-400', 
    'text-puebla-500', 'text-puebla-600', 'text-puebla-700', 'text-puebla-800', 'text-puebla-900',
    'border-puebla-50', 'border-puebla-100', 'border-puebla-200', 'border-puebla-300', 'border-puebla-400', 
    'border-puebla-500', 'border-puebla-600', 'border-puebla-700', 'border-puebla-800', 'border-puebla-900',
    'hover:bg-puebla-700', 'hover:bg-puebla-800', 'hover:text-puebla-700',
    // Colores Accent
    'bg-accent-gold', 'bg-accent-lightBeige', 'bg-accent-beige',
    'text-accent-gold', 'text-accent-lightBeige', 'text-accent-beige',
    // Colores Gobierno
    'bg-gobierno-teal', 'bg-gobierno-mutedGreen', 'bg-gobierno-brightTeal', 'bg-gobierno-gray',
    'text-gobierno-teal', 'text-gobierno-mutedGreen', 'text-gobierno-brightTeal', 'text-gobierno-gray',
    // Colores Adoption
    'bg-adoption-available', 'bg-adoption-process', 'bg-adoption-adopted',
    'text-adoption-available', 'text-adoption-process', 'text-adoption-adopted',
  ],
  theme: {
    extend: {
      colors: {
        // Colores oficiales del Gobierno de Puebla
        puebla: {
          // Burgundy/Maroon principal
          50: '#fdf2f4',
          100: '#fce4e9',
          200: '#f9c9d3',
          300: '#f5a3b5',
          400: '#ee708e',
          500: '#e44b6f',
          600: '#d13159',
          700: '#af1731', // Color principal burgundy
          800: '#931a2f',
          900: '#7a1b2b',
          950: '#450a13',
          burgundy: '#840f31',
          maroon: '#861e34',
        },
        // Colores de acento del gobierno
        accent: {
          gold: '#c79b66',
          lightBeige: '#e2be96',
          beige: '#f5e6d3',
        },
        // Colores neutros gubernamentales
        gobierno: {
          teal: '#0e312d',
          mutedGreen: '#246257',
          brightTeal: '#3d9b84',
          gray: '#b2b2b1',
          lightGray: '#f8f8f8',
          darkGray: '#4a4a4a',
        },
        // Colores para el sistema de adopción
        adoption: {
          available: '#3d9b84', // verde teal
          process: '#c79b66',   // dorado
          adopted: '#b2b2b1',   // gris
          danger: '#af1731',    // burgundy
          success: '#246257',   // verde oscuro
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}

export default config