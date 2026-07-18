# Nexo — Kit de UI da Vitrine (Storefront)

> Primitivos reutilizáveis da loja pública (`/loja/*`). Use-os em **todas** as páginas do storefront
> (home, PLP, produto, checkout, sucesso) para manter uma só linguagem — consistência por componente,
> não à mão. Local: `src/components/Store/ui/` · Import: `@/components/Store/ui`.
>
> Este kit é a camada da **vitrine** (editorial, com respiro e tipografia display). NÃO confunda com o
> `_shared.tsx` do painel do vendedor (ferramenta densa) descrito em `DESIGN_SPEC.md`.

## Fundação (tokens e fontes)

- **Accent do lojista (multi-tenant):** tokens `store` / `store-ink` → `bg-store`, `text-store`, `border-store`,
  `ring-store`, `text-store-ink`, `bg-store-ink`, com opacidade (`bg-store/[0.08]`).
  - Default = índigo Nexo (`--store-accent` em `globals.css`). Cada loja sobrescreve via `brand_color`
    (hex) → `storeAccentStyle(storeInfo)` (de `@/lib/storefront`) aplicado no root da página da vitrine.
  - O **índigo `nxp` fica reservado à chrome da plataforma** (selo "Loja por Nexo"). Não use `nxp` como
    accent da loja.
- **Tinta / superfície:** `nxi1` (título) · `nxi2` (corpo) · `nxi3` (auxiliar, já em contraste AA) ·
  `nxsurf` (card off-white) · `nxbg` (fundo) · `nxborder` (hairline) · `coal` (faixas escuras).
- **Semânticos:** `nxs` sucesso · `nxw` aviso/estrelas · `nxd` erro/promo/wishlist · `wa` WhatsApp.
- **Tipografia:** `font-integral` = voz display (h1/h2/h3 de destaque, `tracking-[-0.03em]`) ·
  `font-sans` (Nunito) = corpo/UI · `font-mono` (IBM Plex Mono) = eyebrows/labels uppercase.
- **Motion:** easing `cubic-bezier(.22,1,.36,1)`; `active:scale-[0.97]`; hover de card = zoom de imagem;
  faixas roláveis com `edge-fade-x` (máscara nas bordas). Respeita `prefers-reduced-motion` (global).
- **Acessibilidade:** todo controle tem `focus-visible:ring-2 ring-store`; alvos de ícone ≥44px.

## Primitivos

| Componente | Uso | Props principais |
|---|---|---|
| `StoreButton` | CTA-pill | `variant` primary·outline·ghost·dark · `size` sm·md·lg · `loading` · props de `<button>` |
| `storeButtonClass(opts)` | link com cara de botão | `<Link className={storeButtonClass({variant:'outline'})}>` |
| `StoreCard` / `storeCardClass` | superfície de card (nxsurf, raio 20, borda) | `interactive` (sombra no hover) |
| `StoreBadge` | selo/pílula mono | `tone` promo·new·neutral·dark·accent |
| `StoreEyebrow` | micro-label mono uppercase | `tone` accent·muted·onDark |
| `StorePill` | pílula selecionável (categoria/filtro) | `active` · `count?` · props de `<button>` |
| `StoreIconButton` | botão-ícone 44px | `variant` ghost·surface·dark · `aria-label` (obrigatório) |
| `SearchField` | input de busca em pill | `value` · `onChange` · `onClear?` · `kbdHint?` · props de `<input>` (ref) |
| `StoreSectionHeader` | eyebrow + título Integral | `eyebrow` · `title` · `size` md·lg |

## Exemplos

```tsx
import { StoreButton, storeButtonClass, StoreEyebrow, StoreBadge, StorePill, SearchField } from '@/components/Store/ui'

<StoreButton variant="primary" size="lg" onClick={onExplore}>Explorar coleção</StoreButton>
<Link href={`/loja/${slug}/produtos`} className={storeButtonClass({ variant: 'outline' })}>Ver todos</Link>

<StoreEyebrow tone="accent">Novidades</StoreEyebrow>
<StoreBadge tone="promo">-18%</StoreBadge>
<StorePill active={active === cat} count={counts[cat]} onClick={() => onSelect(cat)}>{cat}</StorePill>

<SearchField value={q} onChange={onChange} onClear={() => onChange('')} kbdHint="/" placeholder="Buscar…" />
```

## Componentes de vitrine que já consomem o kit

`StoreHomeCard`, `StoreHomeHero`, `StoreFeatureBanner`, `StoreCollectionSection`, `StoreCategoryPills`,
`StoreProductRow`, `StoreHeader`, `StoreSearchDropdown`, `StoreMarquee`, `AnnouncementBar`.

## Ao redesenhar PLP / Produto / Checkout / Sucesso

Reaproveite o kit em vez de recriar botões/inputs/cards/badges. Se faltar um primitivo (ex.: `PriceTag`,
`QuantityStepper`, `TrustRow`, `RangeSlider`), **adicione em `src/components/Store/ui/`** e documente aqui —
não crie variantes soltas por página.
