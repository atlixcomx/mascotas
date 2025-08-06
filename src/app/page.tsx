'use client'

import Link from 'next/link'
import { Heart, Shield, Home, Users, PawPrint, Phone } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gobierno-lightGray">
      {/* Header Oficial */}
      <header className="bg-white shadow-md">
        <div className="bg-puebla-700 h-2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-puebla-700 to-puebla-800 rounded-lg flex items-center justify-center shadow-sm">
                <PawPrint className="text-white h-7 w-7" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-gobierno-teal">Centro de Adopción Atlixco</h1>
                <p className="text-xs text-gobierno-gray">Gobierno Municipal de Atlixco | 2024</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gobierno-darkGray hover:text-puebla-700 font-medium transition-colors">
                Inicio
              </Link>
              <Link href="/perritos" className="text-gobierno-darkGray hover:text-puebla-700 font-medium transition-colors">
                Perritos
              </Link>
              <Link href="/perritos" className="text-gobierno-darkGray hover:text-puebla-700 font-medium transition-colors">
                Adoptar
              </Link>
              <a href="#contacto" className="text-gobierno-darkGray hover:text-puebla-700 font-medium transition-colors">
                Contacto
              </a>
              <Link href="/admin" className="btn-primary text-sm">
                Portal Administrativo
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section con diseño gubernamental */}
      <section className="relative bg-gradient-to-br from-gobierno-teal via-gobierno-mutedGreen to-gobierno-teal py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Dale una Segunda
                <span className="block text-accent-lightBeige">Oportunidad</span>
              </h1>
              <p className="text-xl text-gray-100 mb-8 leading-relaxed">
                En el Centro de Adopción de Atlixco, conectamos corazones con perritos que buscan 
                un hogar lleno de amor y cuidado. Forma parte de nuestra misión social.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/perritos" className="btn-primary text-center">
                  Ver Perritos Disponibles
                </Link>
                <Link href="/perritos" className="btn-secondary text-center bg-white/10 backdrop-blur-sm">
                  Proceso de Adopción
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-3xl font-bold text-white">200+</div>
                    <div className="text-sm text-gray-100">Adoptados</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-3xl font-bold text-accent-lightBeige">45</div>
                    <div className="text-sm text-gray-100">Disponibles</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-3xl font-bold text-white">150+</div>
                    <div className="text-sm text-gray-100">Familias</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Características con diseño gubernamental */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gobierno-teal mb-4">
              ¿Por qué adoptar con nosotros?
            </h2>
            <p className="text-xl text-gobierno-gray max-w-3xl mx-auto">
              Nuestro compromiso es garantizar el bienestar animal y facilitar adopciones responsables
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-accent-beige/10 border border-accent-gold/20 rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-gobierno-brightTeal to-gobierno-mutedGreen rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gobierno-teal mb-3">Cuidado Veterinario</h3>
              <p className="text-gobierno-gray leading-relaxed">
                Todos nuestros perritos están vacunados, desparasitados y esterilizados con certificación oficial.
              </p>
            </div>
            
            <div className="bg-accent-beige/10 border border-accent-gold/20 rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-puebla-700 to-puebla-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gobierno-teal mb-3">Seguimiento Post-Adopción</h3>
              <p className="text-gobierno-gray leading-relaxed">
                Te acompañamos en el proceso de adaptación con visitas programadas y asesoría continua.
              </p>
            </div>
            
            <div className="bg-accent-beige/10 border border-accent-gold/20 rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-gold to-accent-lightBeige rounded-full flex items-center justify-center mx-auto mb-6">
                <Home className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gobierno-teal mb-3">Proceso Digital</h3>
              <p className="text-gobierno-gray leading-relaxed">
                Solicitud en línea, seguimiento por QR y documentación digitalizada para tu comodidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas Oficiales */}
      <section className="py-20 bg-gradient-to-r from-puebla-50 via-white to-accent-beige/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
                <PawPrint className="h-10 w-10 text-puebla-700" />
              </div>
              <div className="text-4xl font-bold text-gobierno-teal mb-2">98%</div>
              <div className="text-gobierno-gray">Tasa de Adopción Exitosa</div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
                <Users className="h-10 w-10 text-gobierno-brightTeal" />
              </div>
              <div className="text-4xl font-bold text-gobierno-teal mb-2">140+</div>
              <div className="text-gobierno-gray">Comercios Pet-Friendly</div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
                <Heart className="h-10 w-10 text-accent-gold" />
              </div>
              <div className="text-4xl font-bold text-gobierno-teal mb-2">24/7</div>
              <div className="text-gobierno-gray">Atención de Emergencias</div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
                <Shield className="h-10 w-10 text-gobierno-mutedGreen" />
              </div>
              <div className="text-4xl font-bold text-gobierno-teal mb-2">100%</div>
              <div className="text-gobierno-gray">Certificación Sanitaria</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section Oficial */}
      <section className="py-20 bg-gradient-to-br from-puebla-700 via-puebla-800 to-puebla-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para cambiar una vida?
          </h2>
          <p className="text-xl text-puebla-100 mb-10 leading-relaxed">
            Cada adopción es una historia de amor que comienza. Sé parte del cambio 
            y encuentra a tu compañero ideal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/perritos" className="bg-white text-puebla-700 hover:bg-puebla-50 px-8 py-4 rounded-lg font-semibold transition-all inline-block shadow-lg">
              Conocer Perritos Disponibles
            </Link>
            <Link href="#contacto" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-puebla-700 px-8 py-4 rounded-lg font-semibold transition-all inline-block">
              Contactar al Centro
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Gubernamental */}
      <footer className="bg-gobierno-teal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-accent-lightBeige">Centro de Adopción</h3>
              <p className="text-gray-300 mb-4">
                Comprometidos con el bienestar animal y la promoción de adopciones responsables 
                en el municipio de Atlixco.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <PawPrint className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-accent-lightBeige">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li><Link href="/perritos" className="text-gray-300 hover:text-white transition-colors">Perritos Disponibles</Link></li>
                <li><Link href="/perritos" className="text-gray-300 hover:text-white transition-colors">Proceso de Adopción</Link></li>
                <li><Link href="/admin" className="text-gray-300 hover:text-white transition-colors">Portal Administrativo</Link></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Términos y Condiciones</a></li>
              </ul>
            </div>
            
            <div id="contacto">
              <h3 className="text-lg font-semibold mb-4 text-accent-lightBeige">Contacto</h3>
              <div className="space-y-2 text-gray-300">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>244 446 0000</span>
                </p>
                <p>Av. Hidalgo #123, Centro</p>
                <p>Atlixco, Puebla. CP 74200</p>
                <p>Lunes a Viernes: 9:00 - 18:00</p>
                <p>Sábados: 9:00 - 14:00</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="text-gray-300">
              © 2024 H. Ayuntamiento de Atlixco. Todos los derechos reservados.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Desarrollado por la Dirección de Innovación Tecnológica Municipal
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}