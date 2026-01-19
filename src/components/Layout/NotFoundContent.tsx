'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components'
import { ArrowLeft } from 'lucide-react'

export function NotFoundContent() {
  const router = useRouter()

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={() => router.back()}
          className="flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>


      </div>
    </>
  )
}

