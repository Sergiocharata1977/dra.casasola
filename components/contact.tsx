import { Button } from '@/components/ui/button'
import { Mail, MessageCircle, Instagram, Facebook } from 'lucide-react'

export function Contact() {
  return (
    <section id="contacto" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 text-balance">
            Contacto
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-12 text-pretty">
            Estamos siempre disponibles para construir un Chaco más libre.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Button
              variant="outline"
              className="h-auto py-6 px-8 border-2 border-gray-200 hover:border-violet-600 hover:bg-violet-50"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="text-violet-600" size={24} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900">WhatsApp</div>
                  <div className="text-sm text-gray-600">Envianos un mensaje</div>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-6 px-8 border-2 border-gray-200 hover:border-violet-600 hover:bg-violet-50"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                  <Mail className="text-violet-600" size={24} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900">Email</div>
                  <div className="text-sm text-gray-600">contacto@mileisudoeste.com</div>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-6 px-8 border-2 border-gray-200 hover:border-violet-600 hover:bg-violet-50"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                  <Instagram className="text-violet-600" size={24} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900">Instagram</div>
                  <div className="text-sm text-gray-600">@mileisudoeste</div>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-6 px-8 border-2 border-gray-200 hover:border-violet-600 hover:bg-violet-50"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                  <Facebook className="text-violet-600" size={24} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900">Facebook</div>
                  <div className="text-sm text-gray-600">Milei Sudoeste Chaco</div>
                </div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
