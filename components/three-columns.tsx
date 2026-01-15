import { TrendingUp, Building2, Shield } from 'lucide-react'

export function ThreeColumns() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 rounded-2xl border-2 border-gray-200 hover:border-violet-300 transition-all hover:shadow-lg">
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="text-violet-600" size={32} />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-4">
              Libertad Económica
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Apoyamos la producción, la creatividad y el desarrollo regional.
            </p>
          </div>

          <div className="text-center p-8 rounded-2xl border-2 border-gray-200 hover:border-violet-300 transition-all hover:shadow-lg">
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="text-violet-600" size={32} />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-4">
              Modernización del Estado
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Un Estado más chico, eficiente y transparente.
            </p>
          </div>

          <div className="text-center p-8 rounded-2xl border-2 border-gray-200 hover:border-violet-300 transition-all hover:shadow-lg">
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="text-violet-600" size={32} />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-4">
              Defensa de la República
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Instituciones fuertes, sin intermediarios ni corporativismos.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
