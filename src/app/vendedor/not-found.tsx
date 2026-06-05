import { NotFoundContent } from '@/components/Layout'

export default function VendedorNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="text-6xl font-bold text-gray-200 select-none">404</p>
      <h1 className="text-xl font-bold text-gray-900">Página não encontrada</h1>
      <p className="max-w-md text-sm text-gray-500">
        O recurso que você procura não existe ou foi removido.
      </p>
      <NotFoundContent />
    </div>
  )
}
