'use client'

import { Fragment } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, LucideIcon } from 'lucide-react'

export interface RowAction {
  label: string
  icon: LucideIcon
  onClick?: () => void
  href?: string
  disabled?: boolean
  destructive?: boolean
  /** Renderiza um divisor antes deste item */
  separatorBefore?: boolean
}

interface RowActionsMenuProps {
  actions: RowAction[]
}

const itemClass =
  'gap-2.5 px-3 py-2 text-[13px] font-medium text-nxi2 focus:bg-nxbg focus:text-nxi1'
const destructiveClass =
  'gap-2.5 px-3 py-2 text-[13px] font-medium text-nxd focus:bg-nxd/[0.06] focus:text-nxd'

export function RowActionsMenu({ actions }: RowActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-nxi3 transition-colors hover:bg-nxbg hover:text-nxi1"
          aria-label="Ações"
        >
          <MoreVertical size={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-44 rounded-xl border-nxborder py-1 shadow-[0_12px_40px_hsl(225_32%_17%/0.16)]"
      >
        {actions.map((action) => {
          const { label, icon: Icon, onClick, href, disabled, destructive, separatorBefore } = action
          const cls = destructive ? destructiveClass : itemClass
          return (
            <Fragment key={label}>
              {separatorBefore && <DropdownMenuSeparator className="my-1 bg-nxborder" />}
              {href ? (
                <DropdownMenuItem asChild disabled={disabled}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
                    <Icon size={14} />
                    {label}
                  </a>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem disabled={disabled} onClick={onClick} className={cls}>
                  <Icon size={14} />
                  {label}
                </DropdownMenuItem>
              )}
            </Fragment>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
