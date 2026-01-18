import { Button } from '@/components/ui/button'
import { Scale, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <section id="inicio" className="relative bg-white pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -z-10" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-slate-100 rounded-full blur-3xl -z-10 opacity-60" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 border-l-4 border-accent pl-4">
              <span className="text-accent font-semibold tracking-wide uppercase text-sm">
                Estudio Jurídico Integral
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-sans font-bold leading-tight text-gray-900 tracking-tight">
              Dra. Lidia <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
                Casasola
              </span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              Soluciones legales efectivas en Derecho Civil y Sucesiones.
              Compromiso, transparencia y defensa de sus intereses patrimoniales y familiares.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/#contacto">
                <Button size="lg" className="rounded-full px-8 bg-gray-900 hover:bg-gray-800 text-white shadow-lg shadow-gray-200/50 transition-all hover:scale-105">
                  Consulta Profesional <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/#servicios">
                <Button
                  size="lg"
                  variant="ghost"
                  className="rounded-full px-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  Nuestras Especialidades
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-100 mt-8">
              <div>
                <p className="text-3xl font-bold text-gray-900">+20</p>
                <p className="text-sm text-gray-500 font-medium mt-1">Años de Trayectoria</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">100%</p>
                <p className="text-sm text-gray-500 font-medium mt-1">Compromiso Legal</p>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Image Container with delicate shadow */}
            <div className="relative z-10 rounded-2xl overflow-hidden bg-white shadow-2xl shadow-gray-200/50 border border-gray-100">
              {/* Aspect Ratio container to force vertical layout matching the photo */}
              <div className="aspect-[3/4] relative">
                <img
                  src="/dra-casasola-profile.png"
                  alt="Dra. Lidia Casasola"
                  className="w-full h-full object-cover object-top"
                />
                {/* Subtle Gradient Overlay at bottom for text readability if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent opacity-50"></div>
              </div>
            </div>

            {/* Decorative Elements replacing blue blocks with subtle lines/shadows */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gray-50 rounded-full -z-10" />
            <div className="absolute -top-6 -left-6 w-24 h-24 border border-gray-200 rounded-full -z-10" />

            {/* Floating Card */}
            <div className="absolute bottom-8 -left-8 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-4 z-20 max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              <div className="bg-blue-50 p-3 rounded-full text-accent">
                <Scale className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Experiencia Civil</p>
                <p className="text-xs text-gray-500">Divorcios • Sucesiones</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
