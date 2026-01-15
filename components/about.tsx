import { Heart, Eye, Target, Zap } from 'lucide-react'

export function About() {
  return (
    <section id="nosotros" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8 text-center text-balance">
            Quiénes Somos
          </h2>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-12 text-center text-pretty">
            Somos un equipo de vecinos, productores, profesionales y jóvenes del Sudoeste chaqueño 
            comprometidos con las ideas de la libertad. Nuestro objetivo es impulsar políticas modernas 
            que liberen la fuerza productiva regional.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4 p-6 rounded-xl bg-gray-50">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                  <Eye className="text-violet-600" size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Transparencia</h3>
                <p className="text-gray-700">Gestión clara y abierta a la ciudadanía.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-xl bg-gray-50">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                  <Heart className="text-violet-600" size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Libertad Individual</h3>
                <p className="text-gray-700">Respeto por las decisiones de cada persona.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-xl bg-gray-50">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                  <Target className="text-violet-600" size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Desarrollo Productivo</h3>
                <p className="text-gray-700">Impulso a la economía local y regional.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-xl bg-gray-50">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                  <Zap className="text-violet-600" size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Modernización del Estado</h3>
                <p className="text-gray-700">Eficiencia y menos burocracia.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
