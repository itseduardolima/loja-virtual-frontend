import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Nunito, IBM_Plex_Mono, Poppins, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import '../styles/toast.css'
import { QueryProvider } from '@/providers/QueryProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { ToastContainer } from '@/components/Toast'
import { CompleteProfileGuard } from '@/components/User'
import { AppFooter } from '@/components/Layout'
import { HotToastProvider } from '@/providers/HotToastProvider'

const satoshi = localFont({
  src: '../../public/fonts/Satoshi-Variable.ttf',
  variable: '--font-satoshi',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
  display: 'swap',
  weight: '100 900',
})

const integralCF = localFont({
  src: '../../public/fonts/integralcf-bold.otf',
  variable: '--font-integral',
  fallback: ['var(--font-satoshi)', 'system-ui', '-apple-system', 'sans-serif'],
  display: 'swap',
  weight: '700',
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['400', '600', '700', '800', '900'],
  display: 'swap',
})

// Voz editorial dos eyebrows/labels da vitrine (mono intencional — mapeado em font-mono)
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  weight: ['500', '600'],
  display: 'swap',
})

// Landing page (fusão Aaply): Poppins nos headlines, Inter no corpo, JetBrains Mono no dashboard mockup do hero
const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '700'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['500', '600'],
  display: 'swap',
})


export const metadata: Metadata = {
  title: 'Loja - Frontend',
  description: 'Sistema de loja online',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${satoshi.variable} ${integralCF.variable} ${nunito.variable} ${ibmPlexMono.variable} ${poppins.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans`}
      >
        <QueryProvider>
          <AuthProvider>
            <CompleteProfileGuard>
              <ToastProvider>
                <HotToastProvider>
                  <div className="flex min-h-screen flex-col">
                    <main className="flex-1">{children}</main>
                  </div>
                  <ToastContainer />
                </HotToastProvider>
              </ToastProvider>
            </CompleteProfileGuard>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
