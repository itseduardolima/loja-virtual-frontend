import { ExternalLink } from 'lucide-react'

interface ViewStoreLinkProps {
  slug: string
}

export function ViewStoreLink({ slug }: ViewStoreLinkProps) {
  return (
    <a
      href={`/loja/${slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-nxborder bg-white px-3 py-1.5 text-[12.5px] font-semibold text-nxi2 no-underline transition-colors hover:border-nxp hover:text-nxp"
    >
      <ExternalLink size={13} />
      Ver minha loja
    </a>
  )
}
