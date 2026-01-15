import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, ArrowRight } from 'lucide-react'

const newsItems = [
  {
    id: 1,
    title: 'Recorrida por Charata: Escuchando a los productores',
    date: '15 de Noviembre, 2024',
    image: '/charata-productores-campo-reunion.jpg',
    excerpt: 'Nos reunimos con productores locales para entender sus necesidades y proponer soluciones.'
  },
  {
    id: 2,
    title: 'Las Breñas: Encuentro con la juventud',
    date: '8 de Noviembre, 2024',
    image: '/jovenes-reunion-politica-argentina.jpg',
    excerpt: 'Jóvenes del Sudoeste se suman al proyecto de libertad y cambio.'
  },
  {
    id: 3,
    title: 'Propuestas para el desarrollo del Sudoeste',
    date: '1 de Noviembre, 2024',
    image: '/mapa-chaco-desarrollo-regional.jpg',
    excerpt: 'Presentamos un plan integral para potenciar la economía regional.'
  }
]

export function News() {
  return (
    <section id="noticias" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 text-balance">
            Noticias y Novedades
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto text-pretty">
            Enterate de las actividades, comunicados y novedades del movimiento Milei Sudoeste Chaco.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-shadow border-2 border-gray-200">
              <CardHeader className="p-0">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm text-violet-600 mb-3">
                  <Calendar size={16} />
                  <span>{item.date}</span>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </CardTitle>
                <p className="text-gray-700 leading-relaxed">{item.excerpt}</p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button variant="ghost" className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 p-0">
                  Leer más
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
