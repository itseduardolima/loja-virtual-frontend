import Link from 'next/link'
import { Check } from 'lucide-react'
import { AUTH_CONTENT, type AuthCtx, type AuthPanelContent } from './authContent'

const AVATARS = ['MR', 'JS', 'AC', '+']

interface AuthLeftPanelProps {
  ctx?: AuthCtx
  /** Conteúdo custom — sobrepõe o copy do ctx (usado pela /assinatura, que troca por step) */
  content?: AuthPanelContent
}

export function AuthLeftPanel({ ctx = 'vendedor', content }: AuthLeftPanelProps) {
  const c = content ?? AUTH_CONTENT[ctx]

  return (
    <div className="relative hidden w-[44%] max-w-[560px] shrink-0 overflow-hidden bg-coal lg:flex lg:flex-col">
      {/* glow índigo + glow laranja + textura de pontos */}
      <div
        aria-hidden
        className="hero-glow lg-float pointer-events-none absolute -left-20 top-1/4 h-96 w-96 rounded-full opacity-25 blur-3xl"
      />
      <div
        aria-hidden
        className="hero-glow-accent pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full opacity-20 blur-3xl"
      />
      <div aria-hidden className="hero-dots pointer-events-none absolute inset-0 opacity-[0.04]" />

      <div className="relative flex h-full flex-col p-10 xl:p-12">
        {/* brand */}
        <Link href="/" className="flex w-fit items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[15px] font-extrabold text-coal">
            N
          </span>
          <span className="font-integral text-[17px] tracking-[0.04em] text-white">NEXO</span>
        </Link>

        {/* pitch central */}
        <div className="my-auto max-w-[400px]">
          <h2 className="whitespace-pre-line text-[30px] font-extrabold leading-[1.1] tracking-[-0.02em] text-white xl:text-[34px]">
            {c.panelTitle}
          </h2>
          <p className="mt-3 text-[14.5px] leading-relaxed text-white/55">{c.panelSub}</p>
          <div className="mt-8 flex flex-col gap-3.5">
            {c.bullets.map((b) => (
              <div key={b} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/[0.10] ring-1 ring-inset ring-white/15">
                  <Check size={13} strokeWidth={3} className="text-white" />
                </span>
                <span className="text-[14px] text-white/80">{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* prova social */}
        <div className="flex items-center gap-3 border-t border-white/10 pt-5">
          <div className="flex -space-x-2">
            {AVATARS.map((initials) => (
              <span
                key={initials}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-coal bg-white/15 text-[9px] font-bold text-white"
              >
                {initials}
              </span>
            ))}
          </div>
          <p className="text-[12px] text-white/40">{c.footer}</p>
        </div>
      </div>
    </div>
  )
}
