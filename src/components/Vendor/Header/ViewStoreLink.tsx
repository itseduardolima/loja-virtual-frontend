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
      className="inline-flex h-[42px] items-center gap-[7px] rounded-[11px] border border-nxborder bg-white px-[14px] text-[13px] font-bold text-nxi2 no-underline transition-colors hover:border-nxp hover:text-nxp"
    >
      <ExternalLink size={15} />
      Ver minha loja
    </a>
  )
}
