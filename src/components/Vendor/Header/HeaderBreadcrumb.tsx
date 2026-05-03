import { ChevronRight } from 'lucide-react'
import { getBreadcrumb } from '@/lib/vendor'

interface HeaderBreadcrumbProps {
  path: string
}

export function HeaderBreadcrumb({ path }: HeaderBreadcrumbProps) {
  const breadcrumb = getBreadcrumb(path)
  return (
    <div className="flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-nxi3">
      <span>{breadcrumb.parent}</span>
      <ChevronRight size={14} className="text-nxi3" />
      <span className="font-semibold text-nxi1">{breadcrumb.current}</span>
    </div>
  )
}
