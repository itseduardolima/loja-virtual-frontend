import { NAVY, STEP_LABELS, STEP_MESSAGES } from '../constants'

export function LeftPanel({ step }: { step: number }) {
  return (
    <div
      className="hidden md:flex flex-col flex-shrink-0 h-screen"
      style={{
        width: '38%',
        background: NAVY,
        backgroundImage: [
          'radial-gradient(ellipse 540px 540px at 110% -10%, rgba(255,255,255,0.07) 0%, transparent 65%)',
          'radial-gradient(ellipse 400px 400px at -10% 110%, rgba(255,255,255,0.05) 0%, transparent 65%)',
          "url(\"data:image/svg+xml,%3Csvg width='22' height='22' viewBox='0 0 22 22' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='11' cy='11' r='1.3' fill='rgba(255,255,255,0.08)'/%3E%3C/svg%3E\")",
        ].join(', '),
        backgroundSize: '100% 100%, 100% 100%, 22px 22px',
      }}
    >
      {/* Wordmark */}
      <div className="px-8 pt-8">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.13)' }}
          >
            <span className="text-xs font-semibold text-white">N</span>
          </div>
          <span className="text-sm font-semibold text-white tracking-wide">nexo</span>
        </div>
        <div className="mt-6 h-px" style={{ background: 'rgba(255,255,255,0.09)' }} />
      </div>

      {/* Steps + message */}
      <div className="flex-1 flex flex-col justify-center px-8">
        <div>
          {STEP_LABELS.map((label, i) => {
            const done = step > i + 1
            const active = step === i + 1
            const last = i === STEP_LABELS.length - 1
            return (
              <div key={i}>
                <div className="flex items-center gap-3 py-0.5">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300"
                    style={{
                      background: done ? '#4ADE80' : active ? '#fff' : 'transparent',
                      border: !done && !active ? '1px solid rgba(255,255,255,0.25)' : 'none',
                    }}
                  />
                  <span
                    className="text-sm"
                    style={{
                      color: done
                        ? 'rgba(255,255,255,0.5)'
                        : active
                          ? '#fff'
                          : 'rgba(255,255,255,0.33)',
                      fontWeight: active ? 600 : 400,
                      textDecoration: done ? 'line-through' : 'none',
                    }}
                  >
                    {label}
                    {active && (
                      <span style={{ marginLeft: 8, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>
                        →
                      </span>
                    )}
                  </span>
                </div>
                {!last && (
                  <div
                    className="ml-[3px] h-7"
                    style={{ borderLeft: '1px dashed rgba(255,255,255,0.13)' }}
                  />
                )}
              </div>
            )
          })}
        </div>

        <p
          className="text-sm leading-relaxed mt-9"
          style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 220 }}
        >
          {STEP_MESSAGES[step - 1]}
        </p>
      </div>

      {/* Help */}
      <div className="px-8 pb-8">
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.32)' }}>
          Precisa de ajuda?
        </span>
      </div>
    </div>
  )
}
