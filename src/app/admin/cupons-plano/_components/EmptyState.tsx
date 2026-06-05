import { Plus } from 'lucide-react'

interface EmptyStateProps {
  hasFilter: boolean
  onCreateClick: () => void
}

export function EmptyState({ hasFilter, onCreateClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-center">
      <svg className="mb-3" width="140" height="100" viewBox="0 0 140 100" fill="none">
        <path d="M14 30 H126 a4 4 0 0 1 4 4 v8 a6 6 0 0 0 0 12 v8 a4 4 0 0 1 -4 4 H14 a4 4 0 0 1 -4 -4 v-8 a6 6 0 0 0 0 -12 v-8 a4 4 0 0 1 4 -4 Z" stroke="#DDE0E8" strokeWidth="2" fill="#FBFAF7" />
        <line x1="58" y1="30" x2="58" y2="66" stroke="#DDE0E8" strokeWidth="2" strokeDasharray="3 3" />
        <text x="22" y="54" fontFamily="monospace" fontSize="11" fill="#8A93A8" fontWeight="600">PLANO</text>
        <text x="72" y="46" fontFamily="monospace" fontSize="9" fill="#DDE0E8" fontWeight="600">CÓDIGO</text>
        <rect x="72" y="50" width="48" height="8" rx="2" fill="#ECEEF3" />
      </svg>
      <h3 className="text-[17px] font-bold text-nxi1">
        {hasFilter ? 'Nenhum cupom encontrado' : 'Nenhum cupom de plano criado'}
      </h3>
      <p className="max-w-xs text-[13px] text-nxi2">
        {hasFilter
          ? 'Tente ajustar o filtro ou a busca.'
          : 'Crie cupons de desconto para campanhas de assinatura.'}
      </p>
      {!hasFilter && (
        <button
          onClick={onCreateClick}
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-nxp px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-nxp/90"
        >
          <Plus className="h-3.5 w-3.5" />
          Criar primeiro cupom
        </button>
      )}
    </div>
  )
}
