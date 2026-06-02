# Nexo — Design System Spec

> Lei de design do painel do vendedor. Todo código novo deve seguir este documento.
> Baseado nos padrões consolidados em `configuracoes/`, `dashboard/` e `SidebarVendedor.tsx`.

---

## 1. Princípios

- **Intenção, não decoração.** Cada decisão visual tem propósito — hierarquia, estado ou ação. Nada ornamental.
- **Ferramenta, não vitrine.** O painel é uma ferramenta de trabalho. Denso, eficiente, sem excessos.
- **Consistência acima de criatividade.** Use os tokens e componentes existentes. Variantes novas só com justificativa clara.
- **Hierarquia visual em toda tela.** Um elemento de maior peso (título/ação principal), um secundário (dados), um terciário (metadados/ajuda).

---

## 2. Paleta de Cores (Nexo Design Tokens)

Definidas em `src/app/globals.css`, mapeadas em `tailwind.config.ts` com suporte a opacidade.

| Token Tailwind | CSS var | Cor base | Uso |
|---|---|---|---|
| `nxp` | `--nxp` | Indigo `#2A2D7C` | Primário, brand, ações principais, links ativos |
| `nxa` | `--nxa` | Laranja `#E8632A` | Destaque, notificações, CTAs secundários, badges novos |
| `nxs` | `--nxs` | Verde `#3F8A66` | Sucesso, status positivo, confirmações |
| `nxw` | `--nxw` | Âmbar `#E8A33D` | Aviso, atenção, pendências |
| `nxd` | `--nxd` | Vermelho `#C13A2E` | Erro, destrutivo, validação negativa |
| `nxsurf` | `--nxsurf` | Off-white `#FBFAF7` | Fundo de cards e superfícies |
| `nxbg` | `--nxbg` | Cinza claro `#F3F4F8` | Fundo de página |
| `nxi1` | `--nxi1` | Tinta forte | Títulos, labels, dados primários |
| `nxi2` | `--nxi2` | Tinta média | Corpo de texto, descrições |
| `nxi3` | `--nxi3` | Tinta suave | Placeholders, metadados, labels secundários |
| `nxborder` | `--nxborder` | Cinza borda | Bordas de cards, inputs, divisores |

### Regras de uso

- **Nunca** usar cores Tailwind genéricas (`gray-500`, `blue-600`, etc.) — sempre tokens `nx*`.
- Opacidades via modificador Tailwind: `bg-nxp/[0.09]`, `text-nxs/80`, `ring-nxp/30`.
- Mapeamento semântico obrigatório:
  - Sucesso → `nxs`
  - Erro / Destrutivo → `nxd`
  - Aviso → `nxw`
  - Info / Destaque → `nxp`
  - Notificação / Novo → `nxa`

---

## 3. Tipografia

Fontes carregadas via `next/font`:
- **Nunito** — corpo e UI (padrão, `font-sans`)
- **Satoshi** — alternativa compacta (`font-satoshi`)
- **Integral CF** — display e branding (`font-integral`)

### Escala

| Papel | Classes Tailwind |
|---|---|
| Título de página | `text-[26px] font-extrabold tracking-[-0.03em] text-nxi1` |
| Título de seção | `text-base font-bold tracking-[-0.01em] text-nxi1` |
| Subtítulo / descrição de seção | `text-[13px] text-nxi2` |
| Label de campo | `text-[12.5px] font-semibold tracking-[0.01em] text-nxi2` |
| Corpo de texto | `text-[13px] font-medium text-nxi2` |
| Texto auxiliar / help | `text-[11.5px] text-nxi3` |
| Badge / chip | `text-[10.5px] font-bold uppercase tracking-[0.04em]` |
| Micro label (seção nav, grupo) | `text-[10px] font-bold uppercase tracking-[0.06em] text-nxi3` |

### Regras

- Tamanhos em `px` arbitrários: `text-[Xpx]`. Não usar a escala padrão Tailwind (`text-sm`, `text-base`, `text-lg`) — exceto onde já consolidado em código existente.
- Tracking negativo em títulos (`-0.03em`, `-0.025em`) é obrigatório para aparência profissional.
- Peso mínimo: `font-medium`. Nunca `font-light` ou `font-normal` em UI.

---

## 4. Espaçamento e Layout

### Hierarquia de gap

| Contexto | Valor |
|---|---|
| Entre seções / cards maiores | `gap-5` |
| Entre campos de formulário | `gap-4` |
| Elementos densos (badges, chips, botões agrupados) | `gap-3` |
| Micro espaçamento (ícone + texto, inline) | `gap-2` |

### Padding interno de cards

```
p-5 md:p-6
```

### Grids de layout

| Padrão | Classes |
|---|---|
| Página de configuração (nav + conteúdo) | `grid-cols-1 lg:grid-cols-[280px_1fr] gap-8` |
| KPI cards (dashboard) | `grid-cols-2 md:grid-cols-4 gap-3` |
| Gráfico + lateral | `grid-cols-1 xl:grid-cols-[2fr_1fr] gap-5` |
| Campos de formulário (2 colunas) | `grid-cols-1 md:grid-cols-2 gap-4 md:gap-5` |

---

## 5. Componentes

### 5.1 Cards

```tsx
// Usar SectionCard de _shared.tsx quando dentro de configuracoes/
import { SectionCard, SectionHeader } from './_shared'

<SectionCard>
  <SectionHeader title="Título" description="Descrição" />
  {/* conteúdo */}
</SectionCard>
```

Classes manuais equivalentes (para fora do escopo de configuracoes/):
```
rounded-2xl border border-nxborder bg-white shadow-[0_1px_2px_hsl(0_0%_0%/0.04)] p-5 md:p-6
```

### 5.2 Botões

| Variante | Quando usar | Componente |
|---|---|---|
| `primary` | Ação principal da tela (salvar, criar, confirmar) | `NxButton` |
| `ghost` | Ações secundárias, cancelar | `NxButton variant="ghost"` |
| `danger` | Ações destrutivas (excluir, revogar) | `NxButton variant="danger"` |

- **Sempre `NxButton`** de `_shared.tsx` para ações de formulário — não o `Button` do shadcn/ui.
- Tamanho padrão: `px-3.5 py-2 rounded-lg text-[13px] font-semibold`.
- Estado de loading: ícone `Loader2 animate-spin` + texto "Salvando…".
- Nunca desabilitar o botão durante loading — usar o estado `loading` do `NxButton`.

```tsx
import { NxButton } from './_shared'

<NxButton loading={isSaving} onClick={handleSubmit}>
  Salvar alterações
</NxButton>
```

### 5.3 Inputs e Selects

Usar `nxInputClass()` de `_shared.tsx` para consistência de estado:

```tsx
import { nxInputClass } from './_shared'

<input
  className={nxInputClass({ error: !!errors.campo })}
  {...register('campo')}
/>
```

Classes base resultantes:
```
h-10 w-full rounded-lg border border-nxborder bg-white px-3 text-[13px] text-nxi1
placeholder:text-nxi3
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nxp/30
transition-colors
```

Estado de erro: `border-nxd focus-visible:ring-nxd/30`

### 5.4 Formulários

Estrutura padrão com os primitivos de `_shared.tsx`:

```tsx
import { FieldGrid, Field, FieldLabel, FieldHelp, FormActions, NxButton } from './_shared'

<FieldGrid columns={2}>
  <Field>
    <FieldLabel required>Nome do campo</FieldLabel>
    <input className={nxInputClass({ error: !!errors.nome })} {...register('nome')} />
    {errors.nome && (
      <FieldHelp variant="error">{errors.nome.message}</FieldHelp>
    )}
  </Field>
</FieldGrid>

<FormActions>
  <NxButton loading={isSaving}>Salvar alterações</NxButton>
</FormActions>
```

Todos os primitivos estão em: `src/app/vendedor/configuracoes/_shared.tsx`

### 5.5 Badges e Status

```tsx
// Padrão de chip semântico
<span className="rounded-full bg-{token}/[0.06] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.04em] text-{token} ring-1 ring-inset ring-{token}/15">
  Ativo
</span>
```

Mapeamento de estado → token:

| Estado | Token |
|---|---|
| Ativo / Sucesso | `nxs` |
| Pendente / Aviso | `nxw` |
| Inativo / Rascunho | `nxi3` |
| Erro / Destrutivo | `nxd` |
| Info / Destaque | `nxp` |
| Novo / Notificação | `nxa` |

### 5.6 Notices / Alertas

```tsx
import { Notice } from './_shared'

<Notice variant="amber">
  Atenção: esta ação não pode ser desfeita.
</Notice>
```

Variantes: `info` (nxp), `amber` (nxw), `error` (nxd).

---

## 6. Sidebar

Arquivo: `src/components/Layout/SidebarVendedor.tsx`

| Propriedade | Valor |
|---|---|
| Largura expandida | `248px` |
| Largura colapsada | `72px` |
| Fundo | `bg-nxsurf border-r border-nxborder` |
| Item ativo | borda esquerda `3px nxp` + `bg-nxp/[0.09]` + ícone `bg-nxp/10` + texto `text-nxp` |
| Item hover | `bg-nxi3/[0.08]` |
| Labels de seção | micro-label uppercase `text-[10px] font-bold tracking-[0.06em] text-nxi3` |
| Transição de colapso | `transition-[width,min-width] duration-200 ease-out` |

---

## 7. Padrões de Página

### Página de configuração

```tsx
export default function MinhaConfigPage() {
  return (
    <SectionCard>
      <SectionHeader
        title="Título da configuração"
        description="Descrição curta do que o usuário pode ajustar aqui."
      />
      <FieldGrid columns={2}>
        {/* campos */}
      </FieldGrid>
      <FormActions>
        <NxButton loading={isSaving}>Salvar alterações</NxButton>
      </FormActions>
    </SectionCard>
  )
}
```

### Página de listagem

```tsx
// Header
<div className="flex items-center justify-between mb-6">
  <div>
    <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-nxi1">
      Produtos
    </h1>
    <p className="text-[13px] text-nxi2 mt-0.5">
      Gerencie o catálogo da sua loja.
    </p>
  </div>
  <NxButton>+ Novo produto</NxButton>
</div>

// Filtros, busca
// Grid ou tabela
// Paginação
```

### Página de dashboard / overview

```tsx
// KPI cards
<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
  {kpis.map(k => <KpiCard key={k.id} {...k} />)}
</div>

// Gráfico + lateral
<div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-5 mt-5">
  <ChartSection />
  <SummarySection />
</div>
```

### Estado vazio

Todo estado vazio deve ter:
1. Ícone ilustrativo (lucide, 40–48px, `text-nxi3`)
2. Título curto (`text-[15px] font-bold text-nxi1`)
3. Descrição (`text-[13px] text-nxi2`)
4. CTA quando aplicável (`NxButton`)

---

## 8. Ícones

Biblioteca: **Lucide React** exclusivamente.  
Tamanhos padrão:

| Contexto | Tamanho |
|---|---|
| Nav sidebar | `size={16}` |
| Inline com texto | `size={14}` — `size={16}` |
| Estado vazio / ilustrativo | `size={40}` — `size={48}` |
| Botão com ícone | `size={14}` — `size={15}` |

**Não usar FontAwesome** — o projeto não carrega a lib (os `fas fa-*` do seed são dados históricos, não renderizam no front).

---

## 9. Sombras e Bordas

| Uso | Classe |
|---|---|
| Card padrão | `shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]` |
| Elemento elevado (modal, dropdown) | `shadow-lg` |
| Logo / avatar | `shadow-[0_4px_12px_hsl(0_0%_0%/0.10)]` |
| Borda de card | `border border-nxborder` |
| Sem borda visível | omitir — não usar `border-transparent` |

---

## 10. Animações e Transições

- Hover de cor/fundo: `transition-colors duration-150`
- Sidebar colapso: `transition-[width,min-width] duration-200 ease-out`
- Loading spinner: `Loader2 animate-spin`
- Fade in de elementos: `transition-opacity duration-200`

Nada de animações complexas no painel — é uma ferramenta, não uma landing page.

---

## 11. O que NÃO fazer

- ❌ `text-gray-*`, `text-blue-*` ou qualquer cor Tailwind genérica — use tokens `nx*`
- ❌ `text-sm`, `text-lg`, `text-xl` da escala Tailwind — use `text-[Xpx]`
- ❌ `font-light` ou `font-normal` — mínimo `font-medium`
- ❌ `Button` do shadcn/ui para ações de formulário — use `NxButton` de `_shared.tsx`
- ❌ Sombras inventadas — use as listadas na seção 9
- ❌ `rounded-full` em cards — apenas em badges, avatares e chips
- ❌ Gaps inconsistentes — seguir hierarquia `gap-5 / gap-4 / gap-3 / gap-2`
- ❌ FontAwesome — use Lucide React
- ❌ Cores hardcoded (`#FFFFFF`, `rgba(...)`) — use tokens ou variáveis CSS

---

## 12. Arquivos de referência

| Arquivo | O que contém |
|---|---|
| `src/app/globals.css` | Definição de todos os tokens CSS (`--nxp`, `--nxbg`, etc.) |
| `tailwind.config.ts` | Mapeamento dos tokens para classes Tailwind, fontes |
| `src/app/vendedor/configuracoes/_shared.tsx` | `SectionCard`, `SectionHeader`, `FieldGrid`, `Field`, `FieldLabel`, `FieldHelp`, `Notice`, `NxButton`, `nxInputClass`, `Switch`, `ToggleRow`, `FormActions` |
| `src/components/Layout/SidebarVendedor.tsx` | Sidebar principal do vendedor |
| `src/app/vendedor/configuracoes/informacoes-basicas/page.tsx` | Referência de página de configuração complexa |
| `src/app/vendedor/configuracoes/pagamento/page.tsx` | Referência de ToggleRow e Notice |
| `src/app/vendedor/dashboard/page.tsx` | Referência de layout de dashboard |

---

*Spec gerada a partir do código existente. Atualizar este documento ao introduzir novos padrões consolidados.*
