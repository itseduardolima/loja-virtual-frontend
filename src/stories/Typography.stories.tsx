import type { Meta, StoryObj } from '@storybook/react'

// ─── Type role row ───────────────────────────────────────────────────────────
// Renderiza um exemplo real do papel tipográfico ao lado da string de classes
// exata da escala (DESIGN_SPEC §3). A classe é LITERAL no campo `example` para
// que o Tailwind a gere em build — nunca construída dinamicamente.
function TypeRow({
  role,
  classes,
  example,
}: {
  role: string
  classes: string
  example: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 py-5 md:flex-row md:items-baseline md:justify-between md:gap-6">
      <div className="min-w-0 flex-1">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.06em] text-nxi3">
          {role}
        </p>
        {example}
      </div>
      <code className="shrink-0 self-start rounded-lg border border-nxborder bg-nxbg px-2.5 py-1.5 text-[11px] font-semibold leading-snug text-nxi2 md:max-w-[340px]">
        {classes}
      </code>
    </div>
  )
}

// ─── Font family card ────────────────────────────────────────────────────────
function FontCard({
  name,
  className,
  role,
  token,
}: {
  name: string
  className: string
  role: string
  token: string
}) {
  return (
    <div className="flex flex-col gap-2.5 rounded-2xl border border-nxborder bg-white p-5 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
      <p className={['text-[26px] leading-none tracking-[-0.02em] text-nxi1', className].join(' ')}>
        Aa Bb Cc
      </p>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[13px] font-bold tracking-[-0.01em] text-nxi1">{name}</span>
          <code className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-nxi3">
            {token}
          </code>
        </div>
        <p className="text-[11.5px] font-medium leading-snug text-nxi2">{role}</p>
      </div>
    </div>
  )
}

// ─── Typography (meta.component) ─────────────────────────────────────────────
function Typography() {
  return (
    <div className="flex flex-col gap-5 bg-nxbg p-6">
      {/* Famílias de fonte */}
      <div className="rounded-2xl border border-nxborder bg-white p-5 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)] md:p-6">
        <div className="mb-5">
          <h3 className="m-0 text-base font-bold tracking-[-0.01em] text-nxi1">
            Famílias de fonte
          </h3>
          <p className="mt-0.5 text-[13px] leading-[1.5] text-nxi2">
            Carregadas via <code className="font-bold text-nxi1">next/font</code>. Nunca usar{' '}
            <code className="font-bold text-nxi1">font-light</code> ou{' '}
            <code className="font-bold text-nxi1">font-normal</code> — peso mínimo{' '}
            <code className="font-bold text-nxi1">font-medium</code>.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <FontCard
            name="Nunito"
            className="font-sans"
            token="font-sans"
            role="Corpo e UI — fonte padrão de todo o painel."
          />
          <FontCard
            name="Satoshi"
            className="font-satoshi"
            token="font-satoshi"
            role="Alternativa compacta para densidade extra."
          />
          <FontCard
            name="Integral CF"
            className="font-integral"
            token="font-integral"
            role="Display e branding — títulos de marca."
          />
        </div>
      </div>

      {/* Escala tipográfica */}
      <div className="rounded-2xl border border-nxborder bg-white p-5 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)] md:p-6">
        <div className="mb-2">
          <h3 className="m-0 text-base font-bold tracking-[-0.01em] text-nxi1">
            Escala tipográfica
          </h3>
          <p className="mt-0.5 text-[13px] leading-[1.5] text-nxi2">
            Cada papel tem uma combinação fixa de classes. Tamanhos em{' '}
            <code className="font-bold text-nxi1">px</code> arbitrários — não usar a escala
            padrão do Tailwind (<code className="font-bold text-nxi1">text-sm</code>,{' '}
            <code className="font-bold text-nxi1">text-base</code>,{' '}
            <code className="font-bold text-nxi1">text-lg</code>).
          </p>
        </div>
        <div className="divide-y divide-nxborder">
          <TypeRow
            role="Título de página"
            classes="text-[26px] font-extrabold tracking-[-0.03em] text-nxi1"
            example={
              <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-nxi1">
                Gerencie sua loja
              </h1>
            }
          />
          <TypeRow
            role="Título de seção"
            classes="text-base font-bold tracking-[-0.01em] text-nxi1"
            example={
              <h2 className="text-base font-bold tracking-[-0.01em] text-nxi1">
                Informações básicas
              </h2>
            }
          />
          <TypeRow
            role="Subtítulo / descrição de seção"
            classes="text-[13px] text-nxi2"
            example={
              <p className="text-[13px] text-nxi2">
                Ajuste os dados que aparecem na vitrine pública da sua loja.
              </p>
            }
          />
          <TypeRow
            role="Label de campo"
            classes="text-[12.5px] font-semibold tracking-[0.01em] text-nxi2"
            example={
              <span className="text-[12.5px] font-semibold tracking-[0.01em] text-nxi2">
                Nome da loja
              </span>
            }
          />
          <TypeRow
            role="Corpo de texto"
            classes="text-[13px] font-medium text-nxi2"
            example={
              <p className="text-[13px] font-medium text-nxi2">
                Os pedidos são enviados diretamente para o seu WhatsApp assim que o cliente
                finaliza a compra.
              </p>
            }
          />
          <TypeRow
            role="Texto auxiliar / help"
            classes="text-[11.5px] text-nxi3"
            example={
              <span className="text-[11.5px] text-nxi3">
                Use até 60 caracteres para melhor exibição.
              </span>
            }
          />
          <TypeRow
            role="Badge / chip"
            classes="text-[10.5px] font-bold uppercase tracking-[0.04em]"
            example={
              <span className="inline-flex items-center gap-1.5 rounded-full bg-nxs/[0.06] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.04em] text-nxs ring-1 ring-inset ring-nxs/15">
                Ativo
              </span>
            }
          />
          <TypeRow
            role="Micro label (nav, grupo)"
            classes="text-[10px] font-bold uppercase tracking-[0.06em] text-nxi3"
            example={
              <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-nxi3">
                Configurações
              </span>
            }
          />
        </div>
      </div>

      {/* Regras */}
      <div className="rounded-2xl border border-nxborder bg-white p-5 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)] md:p-6">
        <div className="mb-4">
          <h3 className="m-0 text-base font-bold tracking-[-0.01em] text-nxi1">Regras</h3>
          <p className="mt-0.5 text-[13px] leading-[1.5] text-nxi2">
            Padrões obrigatórios da escala tipográfica.
          </p>
        </div>
        <ul className="flex flex-col gap-2.5">
          <li className="flex items-start gap-2.5 text-[13px] font-medium leading-relaxed text-nxi2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-nxp" />
            Tracking negativo em títulos (
            <code className="font-bold text-nxi1">-0.03em</code>,{' '}
            <code className="font-bold text-nxi1">-0.01em</code>) para aparência profissional.
          </li>
          <li className="flex items-start gap-2.5 text-[13px] font-medium leading-relaxed text-nxi2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-nxp" />
            Tracking positivo (<code className="font-bold text-nxi1">0.04em</code> /{' '}
            <code className="font-bold text-nxi1">0.06em</code>) em badges e micro labels em
            caixa alta.
          </li>
          <li className="flex items-start gap-2.5 text-[13px] font-medium leading-relaxed text-nxi2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-nxp" />
            Tamanhos sempre em <code className="font-bold text-nxi1">px</code> arbitrários
            (ex.: <code className="font-bold text-nxi1">text-[13px]</code>) — peso mínimo{' '}
            <code className="font-bold text-nxi1">font-medium</code>.
          </li>
        </ul>
      </div>
    </div>
  )
}

const meta: Meta<typeof Typography> = {
  title: 'Design System/Typography',
  component: Typography,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Escala tipográfica do Nexo (DESIGN_SPEC §3). Fontes via `next/font`: **Nunito** (corpo/UI, `font-sans`), **Satoshi** (`font-satoshi`) e **Integral CF** (display/branding, `font-integral`). Tamanhos em `px` arbitrários (`text-[13px]`) — nunca a escala padrão do Tailwind. Peso mínimo `font-medium`.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Typography>

export const Scale: Story = {}
