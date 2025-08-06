import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Colores inspirados en Atlixco y gobierno de Puebla
        atlixco: {
          50: '#fef7f0',
          100: '#feede0',
          200: '#fcd8c0',
          300: '#f9bc95',
          400: '#f59568',
          500: '#f27448', // Color principal naranja
          600: '#e3572f',
          700: '#be4426',
          800: '#973b25',
          900: '#7a3322',
        },
        // Colores gubernamentales (burgundy/maroon)
        gobierno: {
          50: '#fdf2f2',
          100: '#fce7e7',
          200: '#fbd4d4',
          300: '#f8b4b4',
          400: '#f38888',
          500: '#ec5962',
          600: '#d73f47',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        // Colores de estado para adopciones
        adoption: {
          available: '#10b981', // verde
          process: '#f59e0b',    // amarillo
          adopted: '#6b7280',    // gris
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