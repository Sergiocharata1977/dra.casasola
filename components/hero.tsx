import { Button } from '@/components/ui/button'
import { Award } from 'lucide-react'

export function Hero() {
  return (
    <section id="inicio" className="relative bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-medium">
              <Award className="h-4 w-4" />
              Jefa del ANSES
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight text-balance">
              Dra. Lidia Casasola
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 text-pretty">
              Experta en Derecho Previsional y Civil
            </p>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              Más de 20 años de experiencia en Seguridad Social, Jubilaciones, Pensiones y Sucesiones. Asesoramiento
              legal profesional y de confianza.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Consulta Gratuita
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              >
                Ver Servicios
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-secondary">
              <img
                src="/professional-female-lawyer.jpg"
                alt="Dra. Lidia Casasola"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 rounded-lg shadow-xl">
              <div className="text-3xl font-bold">20+</div>
              <div className="text-sm font-medium">Años de Experiencia</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
