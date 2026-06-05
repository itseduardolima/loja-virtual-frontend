# Nexo — Arquitetura e Organização do Frontend

> Padrões obrigatórios para todo código novo. Baseado em `dashboard/`, `produtos/criar` e `produtos/editar/[id]` — as páginas de referência.

---

## 1. Divisão Page / Hook

Toda página interativa segue a separação:

| Arquivo | Responsabilidade |
|---|---|
| `page.tsx` | **Só JSX.** Imports, guards de loading/erro, composição visual. Zero lógica de negócio. |
| `use<NomeDaPagina>.ts` | Todo estado, queries, mutations, handlers e dados derivados. |

### Por que

- `page.tsx` fica legível como template — qualquer dev entende o layout de um olhar.
- O hook é testável isoladamente, sem DOM.
- Evita o anti-padrão de "arquivo de 400 linhas metade lógica metade JSX".

### Referência

```
src/app/vendedor/dashboard/
  page.tsx            ← só JSX, importa useDashboardPage
  useDashboardPage.ts ← period, ranges, queries, callbacks

src/app/vendedor/produtos/criar/
  page.tsx                ← layout + guards, importa useCreateProductPage
  useCreateProductPage.ts ← form, mutations, imagens, nichos, callbacks

src/app/vendedor/produtos/editar/[id]/
  page.tsx               ← mesma estrutura do criar, reutiliza todos os componentes
  useEditProductPage.ts  ← carrega produto existente, mesma mutation pattern
```

### O que fica no hook

- `useState` de UI (modal aberto, ação em curso, erros visíveis)
- `useQuery` / `useMutation` (TanStack React Query)
- `useMemo` para dados derivados (listas filtradas, labels resolvidos)
- `useCallback` para handlers estáveis
- Lógica de validação pré-submit, scroll para o primeiro erro
- Retorno: objeto plano com tudo que `page.tsx` precisa

### O que fica na page

- Estrutura de grid/layout
- Condicionais de loading (`if (isLoading) return <LoadingPage />`)
- Condicionais de erro (`if (isError) return <ErrorState />`)
- Passagem de props para componentes
- Modais e overlays declarados

### O que NÃO fica na page

- `fetch` / `api.get` / `api.post`
- `useState` além de estado de UI trivial (`isOpen`, etc.)
- `useMemo` / `useCallback`
- Lógica condicional de negócio

---

## 2. Server Components vs Client Components

Next.js 14 App Router distingue RSC (Server Component) de Client Component. A escolha errada afeta performance, SEO e tamanho do bundle.

### Regra principal

**Server Component por padrão.** Adicione `'use client'` apenas quando o componente precisar de hooks, interatividade ou APIs do browser.

```
Precisa de useState / useEffect / hooks?        → 'use client'
Precisa de event listeners (onClick, onChange)? → 'use client'
Precisa de APIs do browser (localStorage)?      → 'use client'
Só renderiza dados, sem interatividade?         → Server Component (sem diretiva)
```

### Onde cada tipo se aplica neste projeto

| Contexto | Estratégia | Motivo |
|---|---|---|
| `/loja/[slug]` e sub-rotas (catálogo público) | **RSC + Suspense** para dados estáticos; `'use client'` só para cart/wishlist/busca | SEO, FCP, indexação de produto |
| `/vendedor/*` e `/admin/*` (dashboards autenticados) | **Client-side** via React Query é aceitável | Altamente interativo, dados personalizados, sem benefício de SSR |
| Componentes de layout e navegação | **RSC** se não tiverem estado | Reduz bundle |
| Componentes de UI puros (sem interatividade) | **RSC** | Zero JS enviado |

### Padrão para páginas públicas (`/loja/`)

```typescript
// page.tsx — Server Component (sem 'use client')
import { Suspense } from 'react'
import { ProductGrid } from '@/components/Store/ProductGrid'
import { ProductGridSkeleton } from '@/components/Store/ProductGridSkeleton'

// Dados estáticos/públicos: fetch no servidor, sem React Query
export default async function StorePage({ params }: { params: { slug: string } }) {
  const store = await getStoreBySlug(params.slug) // fetch direto, sem hook
  if (!store) notFound()

  return (
    <main>
      <StoreHero store={store} />
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid storeId={store.id} />  {/* RSC filho com fetch próprio */}
      </Suspense>
    </main>
  )
}
```

### Streaming com `loading.tsx`

Cada rota deve ter `loading.tsx` — é o Suspense boundary automático do App Router:

```
src/app/loja/[slug]/
  page.tsx         ← Server Component
  loading.tsx      ← skeleton exibido durante o streaming
  error.tsx        ← captura erros de fetch/renderização (ver Seção 10)
```

### Hydration boundary

Componentes interativos dentro de uma árvore RSC devem ser marcados com `'use client'` e receber dados como props, não buscar via hook:

```typescript
// correto — recebe dados do RSC pai como props
'use client'
export function AddToCartButton({ productId, stock }: Props) {
  const { addItem } = useCart()
  return <button onClick={() => addItem(productId)}>Adicionar</button>
}

// errado — re-faz fetch que o pai já fez
'use client'
export function AddToCartButton({ productId }: Props) {
  const { data: product } = useProduct(productId) // fetch duplicado
  ...
}
```

---

## 3. Componentes Feature-Scoped

Componentes de uma feature vivem juntos em `src/components/<Feature>/`.

```
src/components/
  Vendor/
    Dashboard/
      DashboardHeader.tsx
      DashboardKpiGrid.tsx
      DashboardRecentOrders.tsx
      DashboardRevenueChart.tsx
      DashboardTopProducts.tsx
      index.ts              ← barrel export do módulo
  ProductForm/
    sections/
      ImagesSection.tsx
      ...
    completion.ts
    CompletionMeter.tsx
    PreviewCard.tsx
    PublishCard.tsx
    ProductFormSections.tsx
    buildProductFormData.ts
    useSharedProductState.ts
    primitives.tsx           ← NxButton, NxBadge etc. específicos do form
    types.ts
    data.ts
```

### Regras de componentes

1. **Nomeie pelo domínio**, não pela estrutura: `DashboardKpiGrid`, não `StatsGrid`.
2. **Barrel export obrigatório** via `index.ts` no diretório da feature — importar pelo módulo, não pelo arquivo:
   ```typescript
   // correto
   import { DashboardHeader, DashboardKpiGrid } from '@/components/Vendor/Dashboard'
   // errado
   import { DashboardHeader } from '@/components/Vendor/Dashboard/DashboardHeader'
   ```
3. **Novos componentes globais** (usados em ≥ 2 features) entram em `src/components/index.ts`.
4. **Componentes locais da página** (usados só nela) ficam no arquivo de page mesmo ou em `_components/` ao lado, sem exportar.

### Primitivos de formulário compartilhados (`_shared/`)

Primitivos usados em todas as telas de configuração do vendedor vivem em `src/app/vendedor/configuracoes/_shared/`, **não** em um único `_shared.tsx`. Um arquivo único acumula indefinidamente; a pasta permite evolução:

```
configuracoes/
  _shared/
    SectionCard.tsx
    SectionHeader.tsx
    FormActions.tsx
    ToggleRow.tsx
    Notice.tsx
    NxButton.tsx
    Switch.tsx
    index.ts          ← re-exporta tudo
```

Enquanto `_shared.tsx` existir como arquivo único, mantê-lo — não fragmentar retroativamente sem necessidade. Para novas seções, criar sub-componentes separados se o arquivo ultrapassar ~200 linhas.

### Quando extrair um componente

Extraia quando **duas** destas condições forem verdade:
- Tem mais de ~25 linhas de JSX
- É usado (ou poderá ser usado) em mais de um lugar
- Tem estado próprio ou lógica de apresentação isolada

Não extraia só para "ficar organizado" — um componente de 8 linhas que não se repete não precisa de arquivo próprio.

---

## 4. Os Três Tipos de Hook e Onde Cada Um Mora

O projeto usa hooks em três papéis distintos. Confundi-los é a fonte mais comum de código duplicado ou mal localizado.

### Tipo 1 — Data hooks (`src/hooks/`)

Encapsulam uma chamada à API. São **compartilhados** — qualquer página ou componente pode importá-los.

```
src/hooks/
  useStore.ts          ← GET /stores/my-store
  useProducts.ts       ← GET /products/my-products + useMutation de status
  useUpdateStore.ts    ← PATCH /stores/:id
  useDashboard.ts      ← GET /dashboard/summary
  useCategories.ts     ← GET /categories
  useWishlist.ts       ← estado local + localStorage
  useDebounce.ts       ← utilitário genérico
  useUnsavedChanges.ts ← comportamento de navegação
```

Estrutura padrão de um data hook:

```typescript
// src/hooks/useStore.ts
export function useStore() {
  return useQuery({
    queryKey: ['store', 'my-store'],
    queryFn: () => api.get('/stores/my-store').then(r => r.data),
    staleTime: 5 * 60 * 1000,
  })
}
```

Regras:
- Um hook por recurso de API (não misture `/products` com `/categories` no mesmo hook).
- `queryKey` como constante no topo se reutilizado em `invalidateQueries`.
- Mutations ficam no mesmo arquivo do hook de query do mesmo recurso (`useProducts` exporta `useUpdateProductStatus`).
- Sem lógica de UI — o hook não sabe se está numa página de admin ou vendedor.

### Tipo 2 — Page hooks (`src/app/.../use<NomeDaPagina>.ts`)

Compõem data hooks + estado local de UI. São **não-reutilizáveis** — existem para servir uma única `page.tsx`.

```
src/app/vendedor/dashboard/useDashboardPage.ts
src/app/vendedor/produtos/criar/useCreateProductPage.ts
src/app/vendedor/produtos/editar/[id]/useEditProductPage.ts
```

Importam data hooks (`useStore`, `useDashboard`, `useNiches`…) e adicionam estado de UI (`period`, `showErrors`, `saveAction`) + handlers (`handlePublish`, `handleDiscard`).

### Tipo 3 — Behavior/utility hooks (`src/hooks/`)

Hooks de comportamento reutilizáveis que não chamam API.

```
useDebounce.ts         ← debounce de valor
useUnsavedChanges.ts   ← guard de navegação com beforeunload + intercept de router
usePlanFeatures.ts     ← permissões derivadas do plano ativo
```

Ficam em `src/hooks/` junto com os data hooks. O critério para entrar aqui: **é reutilizável por mais de uma página**.

### Onde colocar um hook novo — decisão rápida

```
Chama a API?
  └─ Sim → src/hooks/use<Recurso>.ts
  └─ Não, mas é reutilizável?
       └─ Sim → src/hooks/use<Comportamento>.ts
       └─ Não (serve só uma página) → src/app/.../use<NomeDaPagina>.ts
```

Hooks de componente (estado local simples de um componente, sem query) ficam inline no próprio componente — não precisam de arquivo separado.

---

## 5. Compartilhamento de Lógica entre Páginas Similares

Criar e editar o mesmo recurso **compartilham** tudo que for possível.

### Padrão de shared state

Quando criar e editar compartilham estado complexo (imagens, variantes, campos dinâmicos), extraia para um hook compartilhado:

```typescript
// src/components/ProductForm/useSharedProductState.ts
export function useSharedProductState() {
  // imagens, orderedImagesByColor, selectedNicheId, dynamicFieldValues, variantStocks...
  return { selectedImages, orderedImagesByColor, ... }
}
```

`useCreateProductPage` e `useEditProductPage` importam e compõem esse hook.

### Padrão de FormSections compartilhadas

O componente `ProductFormSections` recebe `form` + `niches` + `categories` + handlers — funciona igual para criar e editar. Não duplique seções de formulário: passe props diferentes.

---

## 6. Helpers e Utilitários

### Onde colocar

| Tipo de código | Localização |
|---|---|
| Formatação (moeda, data, CPF, CEP) | `src/lib/utils.ts` |
| Lógica de storefront/vitrine (defaults derivados, chips, marquee) | `src/lib/storefront.ts` |
| URLs de imagens, build de URLs | `src/lib/imageUtils.ts` |
| Helpers específicos do painel do vendedor | `src/lib/vendor.ts` |
| Constantes de breadcrumb, mapa de rotas | `src/lib/vendor.ts` (`BREADCRUMB_MAP`) |
| Builders de `FormData` para POST/PATCH | junto ao módulo (`buildProductFormData.ts`) |

### Regra anti-duplicação

Antes de escrever uma função de formatação, grep em `src/lib/`:

```bash
grep -r "toLocaleString\|Intl.NumberFormat\|formatBRL\|formatPrice\|formatCurrency" src/lib/
```

Se já existe, importe — não crie outra. Hoje o projeto tem **`formatBRL`** (número → R$) e **`formatPrice`** (string|number → R$) em `src/lib/utils.ts`. Use-os.

Mesmo raciocínio para datas (`formatDate` em `utils.ts`) e status de pedido (mapa em `src/lib/vendor.ts`).

---

## 7. Tipos

Todos os tipos globais vivem em `src/types/`. Importar via:

```typescript
import type { Product, StoreInfo, CollectionSort } from '@/types'
```

### Onde **não** declarar tipos

- **Dentro de componentes** — tipo específico de props pode ficar local, mas tipos de domínio (entidades, estados de negócio) vão para `@/types`.
- **Dentro de hooks de página** — se o tipo é retornado ou consumido por mais de um arquivo, mova para `@/types`.
- **Exportados de componentes** — um tipo que `useStoreHomePage.ts` importa de `StoreCollectionSection.tsx` é tipo de domínio; mova para `@/types/store.ts`.

### Convenção de arquivo

| Arquivo | Conteúdo |
|---|---|
| `types/product.ts` | `Product`, `ProductImage`, `StockVariant`... |
| `types/store.ts` | `StoreInfo`, `StoreCategory`, `StoreProductsParams`, `CollectionSort`... |
| `types/order.ts` | `Order`, `OrderItem`, `OrderStatus`... |
| `types/auth.ts` | `User`, `LoginPayload`... |
| `types/index.ts` | Re-exporta tudo — use este no import |

---

## 8. TypeScript e `any`

### Política

`any` é proibido em tipos de domínio (entidades, retornos de hooks, props de componentes). É aceitável como escape hatch temporário em:
- Respostas de API ainda sem tipagem definida — marcar com `// TODO: tipar`
- Integrações externas com tipos ruins ou ausentes

```typescript
// proibido
function useOrders(): any { ... }
const product: any = useProduct(id)

// aceitável temporariamente
const raw = response.data as any // TODO: tipar resposta de /catalog/store/:slug
```

### `unknown` em vez de `any` para entrada externa

Quando o tipo de entrada é desconhecido (resposta de API, payload de evento), prefira `unknown` e faça narrowing explícito:

```typescript
// correto
function parseBusinessHours(raw: unknown): BusinessHours {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) { ... }
}

// evitar
function parseBusinessHours(raw: any): BusinessHours { ... }
```

### Sem `as` em tipos de domínio

```typescript
// errado — suprime erro de tipo real
const store = response.data as StoreInfo

// correto — valida estrutura
const store: StoreInfo = StoreInfoSchema.parse(response.data)
// ou, sem Zod:
const store = response.data as unknown as StoreInfo // só se a API for confiável e tipada no backend
```

### Configuração TypeScript

`tsconfig.json` deve ter `"strict": true`. Não desativar `strictNullChecks` nem `noImplicitAny` para contornar erros — corrija o tipo.

---

## 9. Queries e Mutations (React Query)

### Padrão de hook de dado

```typescript
// src/hooks/useOrders.ts
export function useOrders(params?: OrdersParams) {
  return useQuery({
    queryKey: ['orders', params],       // params no key — re-fetch automático
    queryFn: () => api.get('/orders', { params }),
    staleTime: 60 * 1000,
  })
}
```

- `queryKey` sempre inclui os parâmetros que mudam o resultado.
- `staleTime` padrão: 60s. Reduzir só se os dados precisam estar frescos (ex.: dashboard em tempo real).
- Sem retry em 401 (configurado no `QueryProvider`).

### Padrão de mutation

```typescript
const createMutation = useMutation({
  mutationFn: async (data) => api.post('/products', buildFormData(data)),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['products'] })
    showSuccess('Produto criado!')
    router.push('/vendedor/produtos')
  },
  onError: (err) => {
    const msg = err.response?.data?.message || err.message || 'Erro desconhecido'
    showError(msg, 'Título do erro')
  },
})
```

- `invalidateQueries` no `onSuccess` — nunca manter cache stale após write.
- Erro extraído de `error.response?.data?.message` com fallback para `error.message`.
- `isPending` do mutation → prop `loading` dos botões.

### Params no queryKey

Se o hook aceita `params` opcionais, serialize-os no key:

```typescript
queryKey: ['storeProducts', slug, params]
```

Mudança de qualquer param → refetch automático. Sem `useEffect` manual para sincronizar.

---

## 10. Formulários

Detalhado em [`SPEC_formularios.md`](./SPEC_formularios.md). Resumo dos princípios:

- **React Hook Form** para estado do form; **Yup** para validação (`src/schemas/`).
- **`_shared.tsx`** (em `configuracoes/`) exporta os primitivos de layout de formulário: `SectionCard`, `SectionHeader`, `Field`, `FieldGrid`, `FieldLabel`, `FieldHelp`, `Notice`, `NxButton`. Use para toda tela de configuração.
- **`primitives.tsx`** (em `ProductForm/`) exporta `NxButton`, `NxBadge` do form de produto.
- Erro de validação: mostrar só após primeira tentativa de submit (`showErrors` flag).
- Scroll para o primeiro campo inválido no submit.
- `isDirty` controla botão de salvar e guard de navegação (`useUnsavedChanges`).

### Dirty-check: `isEqual` em vez de `JSON.stringify`

`JSON.stringify` para comparar estado de formulário é frágil: quebra com `Date`, `undefined` vs campo ausente, e objetos com chaves em ordens diferentes.

Use `isEqual` do lodash para comparações estruturais:

```typescript
import isEqual from 'lodash/isEqual'

const isDirty = useMemo(
  () => !isEqual(formState, serverState),
  [formState, serverState],
)
```

Exceção aceitável: arrays de primitivos onde a ordem importa e pode ser normalizada via `.sort()` antes do `JSON.stringify` — como em listas de IDs de métodos de pagamento.

---

## 11. Loading e Error States

### Hierarquia de estados

```typescript
// 1. loading da autenticação / dados fundamentais → LoadingPage (full screen)
if (authLoading || storeLoading) return <LoadingPage />

// 2. dado indispensável ausente → ErrorState
if (!user) return <ErrorState message="..." />

// 3. erro de query → ErrorState inline (não full screen)
if (isError) return <ErrorState message="..." fullScreen={false} />

// 4. loading parcial → skeleton inline no componente filho
// (ex: DashboardKpiGrid recebe isLoading e renderiza seus próprios skeletons)
```

### Skeletons

Cada componente de dados cuida do próprio skeleton quando `isLoading=true`. A page não renderiza condicionais de loading para partes individuais — delega para o componente.

### `error.tsx` — Error Boundary por rota (App Router)

Todo segmento de rota com fetch de dado deve ter `error.tsx` ao lado do `page.tsx`. Ele captura erros de renderização e fetch sem quebrar a rota inteira:

```
src/app/loja/[slug]/
  page.tsx      ← Server Component
  loading.tsx   ← skeleton durante streaming
  error.tsx     ← exibido se page.tsx lançar erro

src/app/vendedor/produtos/
  page.tsx
  loading.tsx
  error.tsx
```

```typescript
// error.tsx — sempre 'use client' (Error Boundary é client-side)
'use client'
import { ErrorState } from '@/components'

export default function RouteError({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorState message={error.message} onRetry={reset} />
}
```

Regra: se a rota tem `loading.tsx`, deve ter `error.tsx`. Um sem o outro deixa buracos no tratamento de estado.

### `notFound()` vs `ErrorState`

- Dado não existe (404 da API) → `notFound()` do Next.js (renderiza `not-found.tsx`)
- Erro de rede ou servidor → `ErrorState` ou `error.tsx`
- Dado ausente por estado de loading → nunca `ErrorState`, sempre skeleton

---

## 12. Navegação

- `useRouter().push()` para navegação programática — nunca `window.location.href`.
- `router.back()` para voltar quando não há destino fixo.
- Parâmetros de URL via `useParams()` (App Router) — tipar: `const id = params.id as string`.
- Redirect pós-submit: sempre para a listagem (`/vendedor/produtos`), nunca recarregar a mesma página.

---

## 13. Testes

### Stack

- **Vitest** como test runner (compatível com Vite/Next.js, API idêntica ao Jest)
- **@testing-library/react** para testes de componente
- **MSW (Mock Service Worker)** para interceptar chamadas HTTP nos testes de integração

### O que testar

| Tipo | O que cobrir | Onde |
|---|---|---|
| Data hooks | queryFn retorna dado correto; mutation chama endpoint certo | `src/hooks/__tests__/` |
| Page hooks | handlers alteram estado corretamente; `isDirty` e `isFormValid` derivam certo | `src/app/.../`.`__tests__/` |
| Utilitários | `formatBRL`, `parseBusinessHours`, schemas Yup | `src/lib/__tests__/` |
| Componentes | renderiza props, dispara callbacks, estados de loading/erro | ao lado do componente |

### O que **não** testar

- Componentes puramente visuais sem lógica (snapshots quebram com qualquer mudança de estilo)
- Detalhes de implementação (estado interno, nome de variável)
- Fluxos completos E2E — isso é para Playwright, fora do escopo aqui

### Padrão de teste de hook

```typescript
// src/hooks/__tests__/useStore.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { server } from '@/test/msw/server'
import { http, HttpResponse } from 'msw'
import { useStore } from '../useStore'
import { createWrapper } from '@/test/utils' // QueryProvider wrapper

it('retorna dados da loja', async () => {
  server.use(
    http.get('/stores/my-store', () => HttpResponse.json({ id: '1', name: 'Minha Loja' })),
  )
  const { result } = renderHook(() => useStore(), { wrapper: createWrapper() })
  await waitFor(() => expect(result.current.isSuccess).toBe(true))
  expect(result.current.data?.name).toBe('Minha Loja')
})
```

### Padrão de teste de utilitário

```typescript
// src/lib/__tests__/utils.test.ts
import { formatBRL } from '../utils'

it('formata valor em reais', () => {
  expect(formatBRL(1990)).toBe('R$ 19,90') // confirmar formato real
})
```

### Cobertura mínima esperada

- Utilitários em `src/lib/`: **100%** — são funções puras, sem custo de mock
- Data hooks críticos (useStore, useProducts, useOrders): **happy path + erro**
- Page hooks com lógica de negócio complexa: **handlers principais + isDirty**

---

## 14. Checklist para Feature Nova

Antes de entregar qualquer página nova, verifique:

- [ ] `page.tsx` contém só JSX — zero `useState` de negócio, zero `api.get`
- [ ] Hook `use<NomeDaPagina>.ts` ao lado do `page.tsx`
- [ ] Componentes da feature em `src/components/<Feature>/` com `index.ts` barrel
- [ ] Nenhuma função de formatação duplicada — checou `src/lib/utils.ts`?
- [ ] Tipos de domínio em `src/types/`, não em componentes
- [ ] `queryKey` inclui todos os params que mudam o resultado
- [ ] `invalidateQueries` no `onSuccess` de toda mutation
- [ ] Erro extraído de `error.response?.data?.message` com fallback
- [ ] Loading state: `LoadingPage` para fundamentos, skeleton delegado para componentes filhos
- [ ] `error.tsx` ao lado de toda `page.tsx` com fetch de dado
- [ ] `loading.tsx` ao lado de toda `page.tsx` com fetch assíncrono
- [ ] Páginas públicas (`/loja/`) usam RSC; `'use client'` só onde há interatividade
- [ ] Dirty-check com `isEqual` (lodash) em formulários complexos; `JSON.stringify` + `.sort()` só para arrays de primitivos
- [ ] Zero `any` em tipos de domínio; `unknown` + narrowing para entrada externa
- [ ] Navegação via `router.push()`, nunca `window.location`
- [ ] `'use client'` em todo componente com hooks ou interatividade
