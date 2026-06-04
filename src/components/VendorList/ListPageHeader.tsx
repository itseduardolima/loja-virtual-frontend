'use client'

import { ReactNode } from 'react'

interface ListPageHeaderProps {
  title: string
  subtitle: ReactNode
  action?: ReactNode
}

export function ListPageHeader({ title, subtitle, action }: ListPageHeaderProps) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-[26px] font-extrabold leading-none tracking-[-0.03em] text-nxi1">
          {title}
        </h1>
        <p className="mt-1.5 text-[13px] text-nxi2">{subtitle}</p>
      </div>
      {action}
    </div>
  )
}
