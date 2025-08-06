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
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                En el Centro de Adopción de Atlixco, conectamos corazones con perritos que buscan un hogar lleno de amor y cuidado. Forma parte de nuestra misión social.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/perritos" className="btn-primary text-lg py-4 px-8 text-center">
                  Ver Perritos Disponibles
                </Link>
                <Link href="#proceso" className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20 rounded-lg px-8 py-4 text-lg font-semibold transition-all text-center border border-white/30">
                  Proceso de Adopción
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-accent-gold to-accent-lightBeige rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6">
                  <h3 className="text-3xl font-bold text-gobierno-teal mb-4">¿Por qué adoptar?</h3>
                  <ul className="space-y-3 text-gobierno-darkGray">
                    <li className="flex items-start">
                      <Heart className="h-6 w-6 text-puebla-700 mr-3 mt-1 flex-shrink-0" />
                      <span>Salvas una vida y ganas un compañero leal</span>
                    </li>
                    <li className="flex items-start">
                      <Shield className="h-6 w-6 text-puebla-700 mr-3 mt-1 flex-shrink-0" />
                      <span>Todos nuestros perritos están vacunados y esterilizados</span>
                    </li>
                    <li className="flex items-start">
                      <Home className="h-6 w-6 text-puebla-700 mr-3 mt-1 flex-shrink-0" />
                      <span>Apoyo continuo durante el proceso de adaptación</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gobierno-brightTeal/10 rounded-full mb-4">
                <Heart className="h-8 w-8 text-gobierno-brightTeal" />
              </div>
              <div className="text-4xl font-bold text-gobierno-teal mb-2">100+</div>
              <div className="text-gobierno-gray">Perritos Rescatados</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-puebla-700/10 rounded-full mb-4">
                <Home className="h-8 w-8 text-puebla-700" />
              </div>
              <div className="text-4xl font-bold text-gobierno-teal mb-2">98%</div>
              <div className="text-gobierno-gray">Tasa de Adopción Exitosa</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-gold/20 rounded-full mb-4">
                <Users className="h-8 w-8 text-accent-gold" />
              </div>
              <div className="text-4xl font-bold text-gobierno-teal mb-2">140+</div>
              <div className="text-gobierno-gray">Comercios Pet-Friendly</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gobierno-mutedGreen/10 rounded-full mb-4">
                <Shield className="h-8 w-8 text-gobierno-mutedGreen" />
              </div>
              <div className="text-4xl font-bold text-gobierno-teal mb-2">100%</div>
              <div className="text-gobierno-gray">Seguimiento Post-Adopción</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="bg-gobierno-lightGray py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gobierno-teal mb-8 text-center">
              ¿Listo para cambiar una vida?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gobierno-teal mb-4">Información de Contacto</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-puebla-700 mr-3" />
                    <span className="text-gobierno-darkGray">(244) 445-0000</span>
                  </div>
                  <div className="flex items-center">
                    <Home className="h-5 w-5 text-puebla-700 mr-3" />
                    <span className="text-gobierno-darkGray">Av. Hidalgo 123, Centro, Atlixco, Puebla</span>
                  </div>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-gobierno-darkGray mb-6">
                  Visita nuestro centro y conoce a tu nuevo mejor amigo
                </p>
                <Link href="/perritos" className="btn-primary inline-block">
                  Ver Perritos Disponibles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}