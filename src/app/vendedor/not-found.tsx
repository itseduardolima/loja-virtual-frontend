import Link from 'next/link'
import { PackageSearch } from 'lucide-react'

export default function VendedorNotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <PackageSearch className="h-12 w-12 text-nxp" />
      <div className="mt-[16px] text-[22px] font-extrabold tracking-[-0.02em] text-nxi1">
        Essa página não existe
      </div>
      <div className="mx-auto mt-[6px] max-w-[360px] text-[14px] font-semibold leading-[1.5] text-nxi2">
        Verifique o endereço ou volte para o painel.
      </div>
      <Link
        href="/vendedor/dashboard"
        className="mt-[20px] inline-flex h-[46px] items-center justify-center rounded-[12px] bg-nxp px-[22px] text-[14px] font-extrabold text-white"
      >
        Voltar ao painel
      </Link>
    </div>
  )
}
