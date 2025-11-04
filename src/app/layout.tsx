import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import '../styles/toast.css'
import { QueryProvider } from '@/providers/QueryProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { ToastContainer } from '@/components/ToastContainer'

const satoshi = localFont({
  src: '../../public/fonts/Satoshi-Variable.ttf',
  variable: '--font-satoshi',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
  display: 'swap',
  weight: '100 900',
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
      <body className={`${satoshi.variable} font-sans`}>
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
              <ToastContainer />
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
