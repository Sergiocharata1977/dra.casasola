import Link from 'next/link'
import { Facebook, Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-100 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-sans font-bold mb-4 text-white">Dra. Lidia Casasola</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Abogada especialista en Derecho Civil y Sucesiones. Brindando asesoramiento jurídico de confianza y calidad profesional.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
                <Facebook className="h-5 w-5 text-white" />
              </Link>
              <Link href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
                <Instagram className="h-5 w-5 text-white" />
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Servicios</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">Sucesiones y Herencias</li>
              <li className="hover:text-white transition-colors cursor-pointer">Divorcios</li>
              <li className="hover:text-white transition-colors cursor-pointer">Contratos Civiles</li>
              <li className="hover:text-white transition-colors cursor-pointer">Daños y Perjuicios</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>Lunes a Viernes: 09:00 - 18:00 hs</li>
              <li>Charata, Chaco</li>
              <li className="pt-2">
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
