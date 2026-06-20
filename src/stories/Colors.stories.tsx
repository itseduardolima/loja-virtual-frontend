import type { Meta, StoryObj } from '@storybook/react'
import { AlertCircle, AlertTriangle, CheckCircle2, Info, Sparkles } from 'lucide-react'

// ─── Swatch ──────────────────────────────────────────────────────────────────
// Bloco visual de um token. A classe de fundo é LITERAL (sem construção dinâmica)
// para que o Tailwind gere as classes em build.
function Swatch({
  swatch,
  name,
  cssVar,
  hex,
  role,
  bordered,
  inkOn,
}: {
  swatch: string
  name: string
  cssVar: string
  hex: string
  role: string
  /** superfícies claras precisam de borda para ficarem visíveis */
  bordered?: boolean
  /** cor do texto sobreposto no preview (para tokens de tinta) */
  inkOn?: string
}) {
  return (
    <div className="flex flex-col gap-2.5 rounded-2xl border border-nxborder bg-white p-3 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
      <div
        className={[
          'flex h-20 items-end justify-end rounded-xl p-2',
          swatch,
          bordered ? 'border border-nxborder' : '',
        ].join(' ')}
      >
        {inkOn && (
          <span className={['text-[10.5px] font-bold tracking-[0.04em]', inkOn].join(' ')}>
            Aa
          </span>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between gap-2">
          <code className="text-[12.5px] font-bold tracking-[-0.01em] text-nxi1">
            {name}
          </code>
          <code className="text-[10.5px] font-bold uppercase tracking-[0.04em] text-nxi3">
            {hex}
          </code>
        </div>
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-nxi3">
          {cssVar}
        </span>
        <p className="mt-0.5 text-[11.5px] font-medium leading-snug text-nxi2">{role}</p>
      </div>
    </div>
  )
}

// ─── Semantic mapping row ────────────────────────────────────────────────────
function SemanticRow({
  icon,
  label,
  token,
  chip,
  desc,
}: {
  icon: React.ReactNode
  label: string
  token: string
  chip: React.ReactNode
  desc: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="flex min-w-0 items-center gap-3">
        {icon}
        <div className="min-w-0">
          <p className="text-[13px] font-bold tracking-[-0.01em] text-nxi1">{label}</p>
          <p className="mt-0.5 text-[11.5px] font-medium text-nxi2">{desc}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {chip}
        <code className="text-[12px] font-bold text-nxi3">{token}</code>
      </div>
    </div>
  )
}

// ─── Palette (meta.component) ────────────────────────────────────────────────
function Palette() {
  return (
    <div className="flex flex-col gap-5 bg-nxbg p-6">
      {/* Marca + estados */}
      <div className="rounded-2xl border border-nxborder bg-white p-5 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)] md:p-6">
        <div className="mb-5">
          <h3 className="m-0 text-base font-bold tracking-[-0.01em] text-nxi1">
            Marca e estados
          </h3>
          <p className="mt-0.5 text-[13px] leading-[1.5] text-nxi2">
            Cores de intenção — marca, destaque e feedback semântico. Use sempre os tokens,
            nunca cores genéricas do Tailwind.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          <Swatch
            swatch="bg-nxp"
            name="nxp"
            cssVar="--nxp"
            hex="#2A2D7C"
            role="Primário, marca, ações principais e links ativos."
          />
          <Swatch
            swatch="bg-nxa"
            name="nxa"
            cssVar="--nxa"
            hex="#E8632A"
            role="Destaque, notificações, CTAs secundários e badges novos."
          />
          <Swatch
            swatch="bg-nxs"
            name="nxs"
            cssVar="--nxs"
            hex="#3F8A66"
            role="Sucesso, status positivo e confirmações."
          />
          <Swatch
            swatch="bg-nxw"
            name="nxw"
            cssVar="--nxw"
            hex="#E8A33D"
            role="Aviso, atenção e pendências."
          />
          <Swatch
            swatch="bg-nxd"
            name="nxd"
            cssVar="--nxd"
            hex="#C13A2E"
            role="Erro, ações destrutivas e validação negativa."
          />
        </div>
      </div>

      {/* Tinta (texto) */}
      <div className="rounded-2xl border border-nxborder bg-white p-5 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)] md:p-6">
        <div className="mb-5">
          <h3 className="m-0 text-base font-bold tracking-[-0.01em] text-nxi1">
            Tinta (hierarquia de texto)
          </h3>
          <p className="mt-0.5 text-[13px] leading-[1.5] text-nxi2">
            Três níveis de tinta para hierarquia: títulos, corpo e metadados.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <Swatch
            swatch="bg-nxi1"
            name="nxi1"
            cssVar="--nxi1"
            hex="hsl(225 32% 17%)"
            role="Tinta forte — títulos, labels e dados primários."
            inkOn="text-white"
          />
          <Swatch
            swatch="bg-nxi2"
            name="nxi2"
            cssVar="--nxi2"
            hex="hsl(225 14% 38%)"
            role="Tinta média — corpo de texto e descrições."
            inkOn="text-white"
          />
          <Swatch
            swatch="bg-nxi3"
            name="nxi3"
            cssVar="--nxi3"
            hex="hsl(225 10% 58%)"
            role="Tinta suave — placeholders, metadados e labels secundários."
            inkOn="text-white"
          />
        </div>
      </div>

      {/* Superfícies + borda */}
      <div className="rounded-2xl border border-nxborder bg-white p-5 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)] md:p-6">
        <div className="mb-5">
          <h3 className="m-0 text-base font-bold tracking-[-0.01em] text-nxi1">
            Superfícies e bordas
          </h3>
          <p className="mt-0.5 text-[13px] leading-[1.5] text-nxi2">
            Fundos neutros e divisores. São claros por natureza, então recebem borda para
            ficarem visíveis aqui.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Swatch
            swatch="bg-white"
            name="white"
            cssVar="bg-white"
            hex="#FFFFFF"
            role="Fundo de cards e elementos elevados."
            bordered
          />
          <Swatch
            swatch="bg-nxsurf"
            name="nxsurf"
            cssVar="--nxsurf"
            hex="#FBFAF7"
            role="Superfície off-white — sidebar e blocos sutis."
            bordered
          />
          <Swatch
            swatch="bg-nxbg"
            name="nxbg"
            cssVar="--nxbg"
            hex="#F3F4F8"
            role="Fundo de página (área de conteúdo)."
            bordered
          />
          <Swatch
            swatch="bg-nxborder"
            name="nxborder"
            cssVar="--nxborder"
            hex="hsl(220 14% 92%)"
            role="Bordas de cards, inputs e divisores."
            bordered
          />
        </div>
      </div>

      {/* Mapeamento semântico */}
      <div className="rounded-2xl border border-nxborder bg-white shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
        <div className="px-5 pt-5 md:px-6">
          <h3 className="m-0 text-base font-bold tracking-[-0.01em] text-nxi1">
            Mapeamento semântico
          </h3>
          <p className="mt-0.5 text-[13px] leading-[1.5] text-nxi2">
            Estados de UI sempre apontam para o mesmo token. Padrão obrigatório.
          </p>
        </div>
        <div className="mt-4 divide-y divide-nxborder border-t border-nxborder">
          <SemanticRow
            icon={<CheckCircle2 size={16} className="shrink-0 text-nxs" />}
            label="Sucesso"
            token="nxs"
            desc="Pedido confirmado, salvo, status positivo."
            chip={
              <span className="inline-flex items-center gap-1.5 rounded-full bg-nxs/[0.06] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.04em] text-nxs ring-1 ring-inset ring-nxs/15">
                Ativo
              </span>
            }
          />
          <SemanticRow
            icon={<AlertCircle size={16} className="shrink-0 text-nxd" />}
            label="Erro / Destrutivo"
            token="nxd"
            desc="Falha de validação, exclusão, ação irreversível."
            chip={
              <span className="inline-flex items-center gap-1.5 rounded-full bg-nxd/[0.06] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.04em] text-nxd ring-1 ring-inset ring-nxd/15">
                Erro
              </span>
            }
          />
          <SemanticRow
            icon={<AlertTriangle size={16} className="shrink-0 text-nxw" />}
            label="Aviso"
            token="nxw"
            desc="Atenção, pendência, ação requer cuidado."
            chip={
              <span className="inline-flex items-center gap-1.5 rounded-full bg-nxw/[0.06] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.04em] text-nxw ring-1 ring-inset ring-nxw/15">
                Pendente
              </span>
            }
          />
          <SemanticRow
            icon={<Info size={16} className="shrink-0 text-nxp" />}
            label="Info / Destaque"
            token="nxp"
            desc="Informação neutra, marca, link ativo."
            chip={
              <span className="inline-flex items-center gap-1.5 rounded-full bg-nxp/[0.06] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.04em] text-nxp ring-1 ring-inset ring-nxp/15">
                Info
              </span>
            }
          />
          <SemanticRow
            icon={<Sparkles size={16} className="shrink-0 text-nxa" />}
            label="Novo / Notificação"
            token="nxa"
            desc="Novidade, badge de destaque, notificação."
            chip={
              <span className="inline-flex items-center gap-1.5 rounded-full bg-nxa/[0.06] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.04em] text-nxa ring-1 ring-inset ring-nxa/15">
                Novo
              </span>
            }
          />
        </div>
        <div className="h-5 md:h-6" />
      </div>
    </div>
  )
}

const meta: Meta<typeof Palette> = {
  title: 'Design System/Colors',
  component: Palette,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Tokens de cor do Nexo (definidos em `src/app/globals.css`, mapeados em `tailwind.config.ts`). Use **somente** estes tokens `nx*` — nunca cores genéricas do Tailwind (`gray-*`, `blue-*`, etc.). Opacidades via modificador: `bg-nxp/[0.06]`, `text-nxs/80`, `ring-nxp/30`.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Palette>

export const Tokens: Story = {}
