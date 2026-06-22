import { COLS } from '../useAdminPlanCouponsPage'

export function SkeletonTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-nxborder bg-white shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#FBFBFD]">
            {COLS.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-[10.5px] font-extrabold uppercase tracking-[.05em] text-nxi3"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-t border-[#F0F1F5]">
              <td className="px-4 py-4"><div className="h-6 w-24 rounded-lg bg-[#ECEDF2]" /></td>
              <td className="px-4 py-4"><div className="h-5 w-20 rounded-full bg-[#ECEDF2]" /></td>
              <td className="px-4 py-4"><div className="h-4 w-16 rounded bg-[#ECEDF2]" /></td>
              <td className="px-4 py-4"><div className="h-4 w-16 rounded bg-[#ECEDF2]" /></td>
              <td className="px-4 py-4"><div className="h-4 w-24 rounded bg-[#ECEDF2]" /></td>
              <td className="px-4 py-4"><div className="h-8 w-20 rounded bg-[#ECEDF2]" /></td>
              <td className="px-4 py-4"><div className="h-4 w-20 rounded bg-[#ECEDF2]" /></td>
              <td className="px-4 py-4"><div className="h-6 w-16 rounded-full bg-[#ECEDF2]" /></td>
              <td className="px-4 py-4"><div className="h-6 w-6 rounded-lg bg-[#ECEDF2]" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
