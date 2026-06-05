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

## 2. Componentes Feature-Scoped

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

### Quando extrair um componente

Extraia quando **duas** destas condições forem verdade:
- Tem mais de ~25 linhas de JSX
- É usado (ou poderá ser usado) em mais de um lugar
- Tem estado próprio ou lógica de apresentação isolada

Não extraia só para "ficar organizado" — um componente de 8 linhas que não se repete não precisa de arquivo próprio.

---

## 3. Os Três Tipos de Hook e Onde Cada Um Mora

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
useUnsavedChanges      ← recebe { hasUnsaved, isLoading } → retorna { showCancelDialog, ... }
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

## 4. Compartilhamento de Lógica entre Páginas Similares

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

## 5. Helpers e Utilitários

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

## 6. Tipos

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

## 7. Queries e Mutations (React Query)

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

## 8. Formulários

Detalhado em [`SPEC_formularios.md`](./SPEC_formularios.md). Resumo dos princípios:

- **React Hook Form** para estado do form; **Yup** para validação (`src/schemas/`).
- **`_shared.tsx`** (em `configuracoes/`) exporta os primitivos de layout de formulário: `SectionCard`, `SectionHeader`, `Field`, `FieldGrid`, `FieldLabel`, `FieldHelp`, `Notice`, `NxButton`. Use para toda tela de configuração.
- **`primitives.tsx`** (em `ProductForm/`) exporta `NxButton`, `NxBadge` do form de produto.
- Erro de validação: mostrar só após primeira tentativa de submit (`showErrors` flag).
- Scroll para o primeiro campo inválido no submit.
- `isDirty` controla botão de salvar e guard de navegação (`useUnsavedChanges`).

---

## 9. Loading e Error States

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

---

## 10. Navegação

- `useRouter().push()` para navegação programática — nunca `window.location.href`.
- `router.back()` para voltar quando não há destino fixo.
- Parâmetros de URL via `useParams()` (App Router) — tipar: `const id = params.id as string`.
- Redirect pós-submit: sempre para a listagem (`/vendedor/produtos`), nunca recarregar a mesma página.

---

## 11. Checklist para Feature Nova

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
- [ ] Navegação via `router.push()`, nunca `window.location`
- [ ] `'use client'` em todo componente com hooks ou interatividade
