import { COLS } from '../useAdminPlanCouponsPage'

export function SkeletonTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-nxborder bg-white shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-nxborder">
            {COLS.map(h => (
              <th key={h} className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-nxi3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b border-nxborder last:border-0">
              <td className="px-4 py-4"><div className="h-6 w-24 rounded-lg bg-nxbg" /></td>
              <td className="px-4 py-4"><div className="h-5 w-20 rounded-full bg-nxbg" /></td>
              <td className="px-4 py-4"><div className="h-4 w-16 rounded bg-nxbg" /></td>
              <td className="px-4 py-4"><div className="h-4 w-16 rounded bg-nxbg" /></td>
              <td className="px-4 py-4"><div className="h-4 w-24 rounded bg-nxbg" /></td>
              <td className="px-4 py-4"><div className="h-8 w-20 rounded bg-nxbg" /></td>
              <td className="px-4 py-4"><div className="h-4 w-20 rounded bg-nxbg" /></td>
              <td className="px-4 py-4"><div className="h-6 w-16 rounded-full bg-nxbg" /></td>
              <td className="px-4 py-4"><div className="h-6 w-6 rounded-lg bg-nxbg" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
