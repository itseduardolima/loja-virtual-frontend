export function OrderSkeleton() {
  return (
    <div className="mx-auto max-w-[1040px] animate-pulse px-5 py-10 md:px-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* coluna esquerda */}
        <div className="space-y-6">
          {/* status banner placeholder */}
          <div className="flex items-center gap-4 rounded-2xl border border-nxborder bg-white p-5">
            <div className="h-12 w-12 shrink-0 rounded-2xl bg-nxbg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 rounded bg-nxbg" />
              <div className="h-3 w-2/3 rounded bg-nxbg" />
            </div>
          </div>
          {/* stepper placeholder */}
          <div className="rounded-2xl border border-nxborder bg-white p-6">
            <div className="mb-6 h-2.5 w-32 rounded bg-nxbg" />
            <div className="flex justify-between">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2.5">
                  <div className="h-12 w-12 rounded-full bg-nxbg" />
                  <div className="h-2.5 w-12 rounded bg-nxbg" />
                </div>
              ))}
            </div>
          </div>
          {/* timeline placeholder */}
          <div className="rounded-2xl border border-nxborder bg-white p-6">
            <div className="mb-5 h-2.5 w-36 rounded bg-nxbg" />
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex gap-3.5 pb-5 last:pb-0">
                <div className="h-8 w-8 shrink-0 rounded-full bg-nxbg" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3.5 w-2/3 rounded bg-nxbg" />
                  <div className="h-2.5 w-1/3 rounded bg-nxbg" />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* coluna direita */}
        <div className="rounded-2xl border border-nxborder bg-white p-5">
          <div className="flex items-center gap-3 border-b border-nxborder pb-4">
            <div className="h-11 w-11 rounded-xl bg-nxbg" />
            <div className="space-y-1.5">
              <div className="h-2 w-8 rounded bg-nxbg" />
              <div className="h-3.5 w-24 rounded bg-nxbg" />
            </div>
          </div>
          <div className="space-y-4 py-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-3 w-20 rounded bg-nxbg" />
                <div className="h-3 w-24 rounded bg-nxbg" />
              </div>
            ))}
          </div>
          <div className="mt-2 h-10 rounded-full bg-nxbg" />
          <div className="mt-2 h-10 rounded-full bg-nxbg" />
        </div>
      </div>
    </div>
  )
}
