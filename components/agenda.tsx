import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Clock } from 'lucide-react'

const events = [
  {
    id: 1,
    title: 'Encuentro en General Pinedo',
    date: '25 de Noviembre, 2024',
    time: '18:00 hs',
    location: 'Plaza Central, General Pinedo',
    description: 'Charla abierta sobre el futuro del Sudoeste chaqueño.'
  },
  {
    id: 2,
    title: 'Recorrida por Hermoso Campo',
    date: '2 de Diciembre, 2024',
    time: '16:00 hs',
    location: 'Municipalidad, Hermoso Campo',
    description: 'Conversatorio con vecinos y productores de la zona.'
  },
  {
    id: 3,
    title: 'Encuentro Regional en Las Breñas',
    date: '10 de Diciembre, 2024',
    time: '19:00 hs',
    location: 'Club Social, Las Breñas',
    description: 'Gran encuentro con todos los referentes del movimiento.'
  }
]

export function Agenda() {
  return (
    <section id="agenda" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 text-balance">
            Agenda y Actividades
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto text-pretty">
            Participá de nuestras actividades en Charata, Las Breñas, General Pinedo, Hermoso Campo y toda la región.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {events.map((event) => (
            <Card key={event.id} className="border-2 border-gray-200 hover:border-violet-300 transition-colors">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {event.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="text-violet-600" size={20} />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="text-violet-600" size={20} />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="text-violet-600" size={20} />
                    <span>{event.location}</span>
                  </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">{event.description}</p>
                <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                  Registrarme
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
