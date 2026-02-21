import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Nunito } from 'next/font/google'
import './globals.css'
import '../styles/toast.css'
import { QueryProvider } from '@/providers/QueryProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { ToastContainer } from '@/components/Toast/ToastContainer'
import { CompleteProfileGuard } from '@/components/User/CompleteProfileGuard'

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
      <body className={`${satoshi.variable} ${integralCF.variable} ${nunito.variable} font-sans`}>
        <QueryProvider>
          <AuthProvider>
            <CompleteProfileGuard>
              <ToastProvider>
                {children}
                <ToastContainer />
              </ToastProvider>
            </CompleteProfileGuard>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
