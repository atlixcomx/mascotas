export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-800 to-red-900 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-xl text-red-900">Centro de Adopción Atlixco</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-slate-700 hover:text-red-800 font-medium">Inicio</a>
              <a href="#" className="text-slate-700 hover:text-red-800 font-medium">Perritos</a>
              <a href="#" className="text-slate-700 hover:text-red-800 font-medium">Adoptar</a>
              <a href="#" className="text-slate-700 hover:text-red-800 font-medium">Contacto</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Dale una Segunda
            <span className="block text-red-800">Oportunidad</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            En el Centro de Adopción de Atlixco, conectamos corazones con perritos que buscan un hogar lleno de amor y cuidado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-red-800 hover:bg-red-900 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Ver Perritos Disponibles
            </button>
            <button className="border-2 border-red-800 text-red-800 hover:bg-red-800 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Proceso de Adopción
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-red-800 mb-2">200+</div>
              <div className="text-slate-600">Perritos Adoptados</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-red-800 mb-2">45</div>
              <div className="text-slate-600">Esperando Adopción</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-red-800 mb-2">150+</div>
              <div className="text-slate-600">Familias Felices</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            ¿Por qué adoptar con nosotros?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-red-800 text-xl">🏥</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Cuidado Veterinario</h3>
              <p className="text-slate-600">Todos nuestros perritos están vacunados, desparasitados y esterilizados.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-red-800 text-xl">💝</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Seguimiento Post-Adopción</h3>
              <p className="text-slate-600">Te acompañamos en el proceso de adaptación de tu nuevo compañero.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-red-800 text-xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Proceso Digital</h3>
              <p className="text-slate-600">Solicitud en línea, seguimiento por QR y documentación digitalizada.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-800 to-red-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para encontrar a tu mejor amigo?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Explora nuestros perritos disponibles y comienza el proceso de adopción hoy mismo.
          </p>
          <button className="bg-white text-red-800 hover:bg-slate-100 px-8 py-3 rounded-lg font-semibold transition-colors">
            Comenzar Adopción
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-slate-400">
              © 2024 Centro de Adopción Atlixco. Con amor para nuestros amigos de cuatro patas.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
