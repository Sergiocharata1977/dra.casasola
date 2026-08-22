import type { Metadata } from 'next'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ListadoNotas } from '@/components/revista/listado-notas'
import { getNotasPublicadas } from '@/lib/server/notas'
import { notasParaListado } from '@/lib/portada'
import { siteConfig } from '@/lib/site-config'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Archivo',
  description: `Todas las notas publicadas por ${siteConfig.nombreCompleto}, con buscador y filtro por seccion.`,
}

export default async function ArchivoPage() {
  const notas = notasParaListado(await getNotasPublicadas())

  return (
    <div className="min-h-screen bg-papel">
      <Header />

      <div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6">
        <header className="filete-seccion pt-3">
          <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-tinta sm:text-5xl">
            Archivo
          </h1>
          <p className="mt-3 max-w-xl font-serif text-base leading-relaxed text-tinta-3">
            Todo lo que publicamos, ordenado de lo mas reciente a lo mas viejo. Nada se borra: si
            corregimos una nota, queda registrada la correccion.
          </p>
        </header>

        <div className="mt-8">
          <ListadoNotas notas={notas} conBuscador conFiltros />
        </div>
      </div>

      <Footer />
    </div>
  )
}
