import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ListadoNotas } from '@/components/revista/listado-notas'
import { getNotasPublicadas } from '@/lib/server/notas'
import { notasParaListado } from '@/lib/portada'
import { getSeccion, secciones, siteConfig } from '@/lib/site-config'

type Props = { params: Promise<{ seccion: string }> }

export const revalidate = 60

export function generateStaticParams() {
  return secciones.map((s) => ({ seccion: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seccion } = await params
  const info = getSeccion(seccion)
  if (!info) return { title: 'Seccion no encontrada' }

  return {
    title: info.nombre,
    description: info.descripcion,
    alternates: { canonical: `${siteConfig.url}/secciones/${info.slug}` },
    openGraph: {
      title: `${info.nombre} | ${siteConfig.nombreCompleto}`,
      description: info.descripcion,
      url: `${siteConfig.url}/secciones/${info.slug}`,
      type: 'website',
    },
  }
}

export default async function SeccionPage({ params }: Props) {
  const { seccion } = await params
  const info = getSeccion(seccion)
  if (!info) notFound()

  const notas = notasParaListado(await getNotasPublicadas())

  return (
    <div className="min-h-screen bg-papel">
      <Header />

      <div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6">
        <header className="filete-seccion pt-3">
          <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-tinta sm:text-5xl">
            {info.nombre}
          </h1>
          <p className="mt-3 max-w-xl font-serif text-base leading-relaxed text-tinta-3">
            {info.descripcion}
          </p>
        </header>

        <div className="mt-8">
          <ListadoNotas notas={notas} seccion={info.slug} conFiltros />
        </div>
      </div>

      <Footer />
    </div>
  )
}
