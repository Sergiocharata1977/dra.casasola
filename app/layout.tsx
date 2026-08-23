import type { Metadata } from 'next'
import { Inter, Playfair_Display, Source_Serif_4 } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import { AnalyticsRevista } from '@/components/analytics-revista'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { siteConfig } from '@/lib/site-config'
import './globals.css'

// Inter: navegacion, volantas, metadatos.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Playfair Display: masthead y titulares.
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '700', '800', '900'],
  display: 'swap',
})

// Source Serif: cuerpo de las notas.
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.nombreCompleto} - ${siteConfig.lema}`,
    template: `%s | ${siteConfig.nombreCompleto}`,
  },
  description: siteConfig.descripcion,
  keywords:
    'Revista No Pauta, noticias Chaco, periodismo independiente, politica, economia, sociedad, judiciales, Charata, actualidad',
  openGraph: {
    title: `${siteConfig.nombreCompleto} - ${siteConfig.lema}`,
    description: siteConfig.descripcion,
    url: siteConfig.url,
    siteName: siteConfig.nombreCompleto,
    locale: siteConfig.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.nombreCompleto} - ${siteConfig.lema}`,
    description: siteConfig.descripcion,
  },
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${playfair.variable} ${sourceSerif.variable} font-sans antialiased`}
      >
        <AuthProvider>
          {children}
          <WhatsAppButton />
          {/* Dentro del provider: necesita useAuth() para no contar a la redaccion. */}
          <AnalyticsRevista />
        </AuthProvider>
      </body>
    </html>
  )
}
