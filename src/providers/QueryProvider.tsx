'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: (failureCount, error: any) => {
              const status = error?.response?.status
              // 401 (sessão) e 404 (recurso inexistente) são definitivos — retry não resolve
              if (status === 401 || status === 404) {
                return false
              }
              return failureCount < 3
            },
          },
          mutations: {
            retry: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
