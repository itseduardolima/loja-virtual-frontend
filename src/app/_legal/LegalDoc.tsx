import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowUpRight, ChevronDown, ListOrdered } from 'lucide-react'

/* ────────────────────────────────────────────────────────────────
   Shell compartilhado dos documentos legais (/termos e /privacidade).
   Server component — sem hooks, sem 'use client'.
   Tokens do design system Nexo (nx*) conforme .specs/DESIGN_SPEC.md.
   ──────────────────────────────────────────────────────────────── */

export interface LegalSection {
  /** Âncora usada no índice — kebab-case, estável (não mudar depois de publicado). */
  id: string
  title: string
  content: ReactNode
}

interface LegalDocProps {
  eyebrow: string
  title: string
  summary: string
  updatedAt: ReactNode
  sections: LegalSection[]
  related: { href: string; label: string }
}

const num = (i: number) => String(i + 1).padStart(2, '0')

export function LegalDoc({
  eyebrow,
  title,
  summary,
  updatedAt,
  sections,
  related,
}: LegalDocProps) {
  return (
    <article id="top" className="min-h-screen bg-nxbg pb-20">
      {/* ── topo ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-nxborder bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-nxp text-[12px] font-extrabold text-white">
              N
            </span>
            <span className="font-integral text-[14px] tracking-[0.04em] text-nxi1">NEXO</span>
          </Link>
          <Link
            href={related.href}
            className="inline-flex items-center gap-1 text-[12.5px] font-bold text-nxp transition-colors hover:text-nxp/80"
          >
            {related.label}
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </header>

      {/* ── cabeçalho do documento ───────────────────────────── */}
      <div className="border-b border-nxborder bg-white">
        <div className="mx-auto max-w-[1120px] px-5 pb-10 pt-10 sm:px-8 sm:pt-14">
          <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-nxi3">
            {eyebrow}
          </span>
          <h1 className="mt-3 max-w-[18ch] text-[30px] font-extrabold leading-[1.1] tracking-[-0.03em] text-nxi1 sm:text-[38px]">
            {title}
          </h1>
          <p className="mt-4 max-w-[62ch] text-[15px] font-medium leading-[1.65] text-nxi2">
            {summary}
          </p>
          <p className="mt-5 text-[12px] font-semibold text-nxi3">
            Última atualização: {updatedAt}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
        <div className="mt-8 gap-10 lg:flex lg:items-start">
          {/* ── índice ─────────────────────────────────────── */}
          <nav
            aria-label="Índice do documento"
            className="mb-8 lg:sticky lg:top-[72px] lg:mb-0 lg:w-[248px] lg:shrink-0"
          >
            {/* mobile: recolhido, sem JS */}
            <details className="group rounded-2xl border border-nxborder bg-white lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3">
                <span className="flex items-center gap-2 text-[13px] font-bold text-nxi1">
                  <ListOrdered size={15} className="text-nxp" />
                  Índice ({sections.length} seções)
                </span>
                <ChevronDown
                  size={16}
                  className="text-nxi3 transition-transform group-open:rotate-180"
                />
              </summary>
              <ul className="border-t border-nxborder px-2 py-2">
                {sections.map((section, i) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="flex gap-2 rounded-lg px-2 py-1.5 text-[13px] font-semibold text-nxi2"
                    >
                      <span className="font-mono text-[11px] text-nxi3">{num(i)}</span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </details>

            {/* desktop */}
            <div className="hidden lg:block">
              <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-nxi3">
                Neste documento
              </span>
              <ul className="mt-3 space-y-0.5 border-l border-nxborder">
                {sections.map((section, i) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="-ml-px flex gap-2 border-l border-transparent py-1.5 pl-3 text-[12.5px] font-semibold leading-[1.4] text-nxi2 transition-colors hover:border-nxp hover:text-nxp"
                    >
                      <span className="font-mono text-[10.5px] leading-[1.6] text-nxi3">
                        {num(i)}
                      </span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* ── corpo ──────────────────────────────────────── */}
          <div className="min-w-0 flex-1">
            <div className="space-y-3">
              {sections.map((section, i) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24 rounded-2xl border border-nxborder bg-white p-6 sm:p-8"
                >
                  <h2 className="flex items-baseline gap-3 text-[19px] font-extrabold tracking-[-0.02em] text-nxi1">
                    <span className="font-mono text-[12px] font-semibold text-nxp">{num(i)}</span>
                    {section.title}
                  </h2>
                  <div className="mt-4 space-y-4">{section.content}</div>
                </section>
              ))}
            </div>

            <p className="mt-6 text-center text-[12px] font-semibold text-nxi3">
              <a href="#top" className="hover:text-nxp">
                Voltar ao topo
              </a>
              {' · '}
              <Link href={related.href} className="text-nxp hover:text-nxp/80">
                {related.label}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}


/* ── primitivas tipográficas ─────────────────────────────────── */

export function P({ children }: { children: ReactNode }) {
  return <p className="text-[14px] font-medium leading-[1.75] text-nxi2">{children}</p>
}

export function Sub({ children }: { children: ReactNode }) {
  return (
    <h3 className="pt-2 text-[14px] font-extrabold tracking-[-0.01em] text-nxi1">{children}</h3>
  )
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5 text-[14px] font-medium leading-[1.7] text-nxi2">
          <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-nxp/45" />
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-bold text-nxi1">{children}</strong>
}

export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-nxp/20 bg-nxp/[0.04] p-4">
      <p className="text-[12.5px] font-extrabold uppercase tracking-[0.04em] text-nxp">{title}</p>
      <div className="mt-2 space-y-2 text-[13.5px] font-medium leading-[1.7] text-nxi2">
        {children}
      </div>
    </div>
  )
}

export function DataTable({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="-mx-1 overflow-x-auto pb-1">
      <table className="w-full min-w-[520px] border-collapse text-left">
        <thead>
          <tr>
            {head.map((h) => (
              <th
                key={h}
                className="border-b border-nxborder px-3 py-2 text-[10.5px] font-bold uppercase tracking-[0.05em] text-nxi3"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="align-top">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="border-b border-nxborder/70 px-3 py-2.5 text-[13px] font-medium leading-[1.6] text-nxi2"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
