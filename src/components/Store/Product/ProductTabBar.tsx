'use client'

type TabKey = 'specs' | 'reviews' | 'questions'

interface Tab {
  key: TabKey
  label: string
  badge?: number
  show: boolean
}

interface ProductTabBarProps {
  activeTab: TabKey
  tabs: Tab[]
  onSelect: (key: TabKey) => void
}

export function ProductTabBar({ activeTab, tabs, onSelect }: ProductTabBarProps) {
  return (
    <div className="flex border-b border-gray-200">
      {tabs
        .filter((t) => t.show)
        .map((tab) => (
          <button
            key={tab.key}
            onClick={() => onSelect(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab.key
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {!!tab.badge && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
    </div>
  )
}

export type { TabKey }
