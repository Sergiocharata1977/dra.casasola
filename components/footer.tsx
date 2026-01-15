import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Dra. Lidia Casasola</h3>
            <p className="text-primary-foreground/80 text-sm">
              Experta en Derecho Previsional y Civil. Comprometida con la justicia social y los derechos de cada
              persona.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>Jubilaciones</li>
              <li>Pensiones</li>
              <li>Sucesiones</li>
              <li>Derecho Civil</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>+54 11 1234-5678</li>
              <li>contacto@lidiacasasola.com.ar</li>
              <li>Av. Corrientes 1234, CABA</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex justify-between items-center text-sm text-primary-foreground/60">
          <p>© 2026 Dra. Lidia Casasola. Todos los derechos reservados.</p>
          <Link
            href="/login"
            className="hover:text-accent transition-colors"
          >
            Acceso Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
