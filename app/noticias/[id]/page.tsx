import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { NotaDetalle } from '@/components/revista/nota-detalle'
import { getNota, getNotasPublicadas } from '@/lib/server/notas'
import { hrefNota, resumenDe } from '@/lib/portada'
import { nombreSeccion, siteConfig } from '@/lib/site-config'

type Props = { params: Promise<{ id: string }> }

export const revalidate = 60

/** Prerenderiza las notas publicadas; el resto se genera a demanda. */
export async function generateStaticParams() {
  const notas = await getNotasPublicadas()
  return notas.slice(0, 50).map((n) => ({ id: n.slug || n.id }))
}

/**
 * Metadatos por nota.
 *
 * Esto es lo que leen WhatsApp, Facebook y Google al recibir un enlace.
 * Sin esto todas las notas se comparten con el mismo titulo generico.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { nota } = await getNota(id)

  if (!nota) {
    return { title: 'Nota no encontrada', robots: { index: false, follow: true } }
  }

  const descripcion = nota.bajada || nota.summary || resumenDe(nota, 160)
  const url = `${siteConfig.url}${hrefNota(nota)}`
  const publicada = nota.publishedAt || nota.createdAt

  return {
    title: nota.title,
    description: descripcion,
    authors: [{ name: nota.author }],
    alternates: { canonical: url },
    openGraph: {
      title: nota.title,
      description: descripcion,
      url,
      siteName: siteConfig.nombreCompleto,
      locale: siteConfig.locale,
      type: 'article',
      publishedTime: publicada,
      modifiedTime: nota.updatedAt || publicada,
      authors: [nota.author],
      section: nombreSeccion(nota.seccion),
      tags: nota.tags,
      images: nota.imageUrl ? [{ url: nota.imageUrl, alt: nota.epigrafe || nota.title }] : undefined,
    },
    twitter: {
      card: nota.imageUrl ? 'summary_large_image' : 'summary',
      title: nota.title,
      description: descripcion,
      images: nota.imageUrl ? [nota.imageUrl] : undefined,
    },
  }
}

/**
 * El parametro se llama `id` por compatibilidad con los enlaces viejos,
 * pero acepta tanto el slug editorial como el id de Firestore.
 */
export default async function NotaPage({ params }: Props) {
  const { id } = await params
  const { nota, relacionadas } = await getNota(id)

  if (!nota) notFound()

  const publicada = nota.publishedAt || nota.createdAt

  // Datos estructurados: le dicen a Google que esto es una nota periodistica.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: nota.title,
    description: nota.bajada || nota.summary || resumenDe(nota, 160),
    datePublished: publicada,
    dateModified: nota.updatedAt || publicada,
    author: [{ '@type': 'Person', name: nota.author }],
    publisher: {
      '@type': 'Organization',
      name: siteConfig.nombreCompleto,
      url: siteConfig.url,
    },
    mainEntityOfPage: `${siteConfig.url}${hrefNota(nota)}`,
    articleSection: nombreSeccion(nota.seccion),
    ...(nota.imageUrl ? { image: [nota.imageUrl] } : {}),
    // Google indexa el video aparte de la nota y lo muestra en la pestana
    // Videos. Sin esto, un video propio no aparece en ninguna busqueda.
    ...(nota.videoUrl
      ? {
          video: {
            '@type': 'VideoObject',
            name: nota.title,
            description: nota.videoEpigrafe || nota.bajada || nota.summary || nota.title,
            contentUrl: nota.videoUrl,
            uploadDate: publicada,
            ...(nota.imageUrl ? { thumbnailUrl: [nota.imageUrl] } : {}),
          },
        }
      : {}),
  }

  return (
    <div className="min-h-screen bg-papel">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <NotaDetalle nota={nota} relacionadas={relacionadas} />
      <Footer />
    </div>
  )
}
