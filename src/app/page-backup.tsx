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