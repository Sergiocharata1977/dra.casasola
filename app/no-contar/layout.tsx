import type { Metadata } from 'next'

/**
 * Pagina interna: no tiene que aparecer en Google ni en el sitemap.
 *
 * La metadata vive aca y no en page.tsx porque la pagina es client component
 * y en App Router un archivo con 'use client' no puede exportar `metadata`.
 */
export const metadata: Metadata = {
  title: 'No contar este navegador',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NoContarLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
