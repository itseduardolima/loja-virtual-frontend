interface SidebarSectionProps {
  label: string
  collapsed: boolean
  children: React.ReactNode
}

export function SidebarSection({ label, collapsed, children }: SidebarSectionProps) {
  return (
    <div className="mb-1">
      {!collapsed && (
        <div className="px-2 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-[0.08em] text-nxi3">
          {label}
        </div>
      )}
      {children}
    </div>
  )
}
