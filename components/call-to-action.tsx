import { Button } from '@/components/ui/button'
import { Users } from 'lucide-react'

export function CallToAction() {
  return (
    <section className="py-16 md:py-24 bg-violet-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <Users className="w-16 h-16 mx-auto mb-6" />
        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-balance">
          Sé parte del cambio
        </h2>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-pretty">
          Unite, participá y ayudanos a transformar el Chaco.
        </p>
        <Button 
          size="lg" 
          className="bg-white text-violet-600 hover:bg-gray-100 text-lg px-8 py-6"
        >
          Sumarme Ahora
        </Button>
      </div>
    </section>
  )
}
