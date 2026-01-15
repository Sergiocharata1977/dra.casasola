import { Hero } from '@/components/hero'
import { SobreMi } from '@/components/sobre-mi'
import { Servicios } from '@/components/servicios'
import { ContactoForm } from '@/components/contacto-form'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <SobreMi />
      <Servicios />
      <ContactoForm />
      <Footer />
    </div>
  )
}
