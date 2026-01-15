'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-serif font-bold text-primary">
              Dra. Lidia Casasola
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline gap-6">
              <Link href="#inicio" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
                Inicio
              </Link>
              <Link
                href="#sobre-mi"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                Sobre Mí
              </Link>
              <Link
                href="#servicios"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                Servicios
              </Link>
              <Link href="#contacto">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Contacto</Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col gap-4">
              <Link href="#inicio" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
                Inicio
              </Link>
              <Link
                href="#sobre-mi"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                Sobre Mí
              </Link>
              <Link
                href="#servicios"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                Servicios
              </Link>
              <Link href="#contacto">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Contacto</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
