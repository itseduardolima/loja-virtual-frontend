import Link from 'next/link'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-nxbg px-4">
      <div className="relative text-center">
        <div className="select-none text-[120px] font-black leading-[0.9] tracking-[-0.05em] text-nxborder">
          404
        </div>
        <span className="absolute left-1/2 top-[24px] -translate-x-1/2">
          <Compass className="h-10 w-10 text-nxp" />
        </span>
        <div className="mt-[18px] text-[22px] font-extrabold tracking-[-0.02em] text-nxi1">
          Página não encontrada
        </div>
        <div className="mx-auto mt-[6px] max-w-[380px] text-[14px] font-semibold leading-[1.5] text-nxi2">
          O endereço que você tentou acessar não existe ou foi movido.
        </div>
        <Link
          href="/"
          className="mt-[20px] inline-flex h-[46px] items-center justify-center rounded-[12px] bg-nxp px-[22px] text-[14px] font-extrabold text-white"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  )
}
