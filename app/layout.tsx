import type { Metadata } from 'next'
import { Montserrat, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ['400', '700', '800', '900'],
  variable: '--font-montserrat'
})

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Dra. Lidia Casasola - Abogada Especialista en Derecho Previsional',
  description: 'Experta en Derecho Previsional y Civil. Más de 20 años de experiencia en Jubilaciones, Pensiones y Sucesiones. Consulta gratuita.',
  keywords: 'Abogada, Derecho Previsional, Jubilaciones, Pensiones, Sucesiones, ANSES, Lidia Casasola',
  generator: 'v0.app',
  openGraph: {
    title: 'Dra. Lidia Casasola - Abogada Especialista en Derecho Previsional',
    description: 'Experta en Derecho Previsional y Civil. Más de 20 años de experiencia en Jubilaciones, Pensiones y Sucesiones.',
    url: 'https://dra-casasola.vercel.app',
    siteName: 'Dra. Lidia Casasola',
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dra. Lidia Casasola - Abogada',
    description: 'Experta en Derecho Previsional y Civil. Consulta gratuita.',
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
      <body className={`${montserrat.variable} ${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
