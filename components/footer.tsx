import Link from 'next/link'
import { Facebook, Instagram, MapPin, Phone, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-100 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-sans font-bold mb-4 text-white">Dra. Lidia Casasola</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
              Abogada especialista en Derecho Civil y Sucesiones. Más de 20 años brindando asesoramiento jurídico de confianza y calidad profesional.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="bg-gray-800 p-2.5 rounded-full hover:bg-gray-700 transition-colors">
                <Facebook className="h-5 w-5 text-white" />
              </Link>
              <Link href="#" className="bg-gray-800 p-2.5 rounded-full hover:bg-gray-700 transition-colors">
                <Instagram className="h-5 w-5 text-white" />
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-white mb-4">Servicios</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">Sucesiones y Herencias</li>
              <li className="hover:text-white transition-colors cursor-pointer">Divorcios</li>
              <li className="hover:text-white transition-colors cursor-pointer">Contratos Civiles</li>
              <li className="hover:text-white transition-colors cursor-pointer">Daños y Perjuicios</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-4">Contacto</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Chacabuco 56<br />Charata, Chaco, Argentina</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:+543731532578" className="hover:text-white transition-colors">
                  +54 3731 532578
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:contacto@lidiacasasola.com.ar" className="hover:text-white transition-colors">
                  contacto@lidiacasasola.com.ar
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Dra. Lidia Casasola. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Política de Privacidad</Link>
            <Link
              href="/login"
              className="hover:text-white transition-colors"
            >
              Acceso Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
