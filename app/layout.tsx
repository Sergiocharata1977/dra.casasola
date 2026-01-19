import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/contexts/AuthContext'
import { WhatsAppButton } from '@/components/whatsapp-button'
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Dra. Lidia Casasola - Abogada Especialista en Derecho Civil',
  description: 'Abogada experta en Derecho Civil, Sucesiones y Familia. Más de 20 años de experiencia. Asesoramiento legal profesional en Charata, Chaco.',
  keywords: 'Abogada, Derecho Civil, Sucesiones, Divorcios, Familia, Contratos, Lidia Casasola, Charata, Chaco',
  generator: 'v0.app',
  openGraph: {
    title: 'Dra. Lidia Casasola - Abogada Especialista en Derecho Civil',
    description: 'Abogada experta en Derecho Civil, Sucesiones y Familia. Más de 20 años de experiencia.',
    url: 'https://dra-casasola.vercel.app',
    siteName: 'Dra. Lidia Casasola',
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dra. Lidia Casasola - Abogada',
    description: 'Abogada experta en Derecho Civil, Sucesiones y Familia.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
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
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <WhatsAppButton />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
