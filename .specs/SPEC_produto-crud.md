# SPEC — Produto CRUD (Criar / Editar)

> Spec de feature. Complementa `DESIGN_SPEC.md` — seguir todos os tokens, tipografia e componentes definidos lá.

---

## Visão geral

O cadastro de produto usa um **layout de página única com seções ancoradas** (estilo Shopify). O vendedor preenche as seções em qualquer ordem; uma sidebar sticky exibe progresso, preview e ações de publicação. O mesmo layout é usado em criação e edição — diferem apenas na carga inicial de dados, endpoint chamado e ações disponíveis.

**Rotas:**
- Criar: `/vendedor/produtos/criar`
- Editar: `/vendedor/produtos/editar/[id]`

### Estrutura de arquivos

```
src/
├── app/vendedor/produtos/
│   ├── criar/
│   │   ├── page.tsx                  # página de criação (~340 linhas)
│   │   └── useCreateProductPage.ts   # hook: estado + mutação POST /products
│   └── editar/[id]/
│       ├── page.tsx                  # página de edição (~430 linhas)
│       └── useEditProductPage.ts     # hook: estado + mutação PATCH /products/:id
├── components/ProductForm/
│   ├── sections/
│   │   ├── BasicInfoSection.tsx      # seção "Informações básicas"
│   │   ├── NicheSection.tsx          # seção "Tipo e nicho"
│   │   ├── VariantsSection.tsx       # seção "Variantes e estoque"
│   │   ├── ImagesSection.tsx         # seção "Imagens"
│   │   └── SpecsSection.tsx          # seção "Especificações"
│   ├── ProductFormSections.tsx       # wrapper das 4 seções compartilhadas (exceto Imagens)
│   ├── CompletionMeter.tsx           # anel SVG de progresso + checklist ancorável
│   ├── PreviewCard.tsx               # card de preview do produto (sidebar)
│   ├── PublishCard.tsx               # ações de publicação + segmented status (sidebar)
│   ├── StorefrontPreviewModal.tsx    # modal de pré-visualização da vitrine
│   ├── ColorPickerField.tsx          # popover de seleção de cor com famílias
│   ├── buildProductFormData.ts       # constrói o FormData para POST e PATCH
│   ├── previewUtils.ts               # usePreviewUrlCache + buildPreviewData
│   ├── useSharedProductState.ts      # estados e handlers comuns (imagens, nicho, variantes)
│   ├── useFormWatchers.ts            # centraliza os watch() do RHF
│   ├── primitives.tsx                # SectionCard, NxButton, RadioPills, CheckChips, etc.
│   ├── inputs.tsx                    # NxInput, NxSelectNative, NxTextarea
│   ├── completion.ts                 # computeCompletion() — 5 itens de progresso
│   ├── data.ts                       # COLOR_FAMILIES, getColorHex, slugify, getNicheIcon
│   └── types.ts                      # OrderedImage, CompletionItem, StorefrontPreviewData
└── hooks/
    └── useUnsavedChanges.ts          # guard de navegação (beforeunload + router interception)
```

---

## Layout da página

```
[Header: título + botões Pré-visualizar / Descartar]          (desktop)

[Seções principais]                  [Sidebar sticky 340px]   (desktop)
  BasicInfoSection                     CompletionMeter
  NicheSection                         PreviewCard
  VariantsSection                      PublishCard
  ImagesSection
  SpecsSection

[Barra de ação fixa no bottom]                                 (mobile)
```

**Mobile:** CompletionMeter e PreviewCard aparecem no topo da página (acima das seções). A barra de ação fixa no bottom tem os botões de salvar.

---

## Seções

### 1 — Informações básicas (`sec-basico`)

| Campo | Obrigatório | Notas |
|---|---|---|
| Nome | Sim | min 3, max 200 chars; contador inline |
| Preço | Sim | decimal R$; `parseBRL` / `formatBRL` |
| Preço promocional | Não | deve ser < preço; exige datas |
| Data início promoção | Condicional | obrigatório se `promo_price` preenchido |
| Data fim promoção | Condicional | obrigatório se `promo_price` preenchido |
| Descrição | Não | TipTap rich-text; HTML sanitizado |
| Produto em destaque | Não | toggle; exibe badge "Destaque" na vitrine |

### 2 — Tipo e nicho (`sec-nicho`)

Seção dividida em três partes em sequência:

**2a. Grade de nichos**
- Grid de cards com ícone Lucide (mapeado por slug em `data.ts`) + nome
- Seleção altera os campos dinâmicos exibidos abaixo
- Ao mudar nicho: `dynamicFieldValues` é limpo (create) ou preservado (edit)

**2b. Categoria**
- Select das categorias da loja filtradas pelo nicho selecionado
- Botão "Nova categoria" abre `CreateCategoryModal`

**2c. Campos dinâmicos do nicho**
- Renderizados conforme `field_type` retornado pela API (`useNicheFields`)

| `field_type` | Componente |
|---|---|
| `text` | `NxInput` |
| `textarea` | `NxTextarea` |
| `number` | `NxInput type="number"` |
| `select` | `CheckChips` (multi-valor, comma-separated) |
| `radio` | `RadioPills` (valor único) |
| `color` | `ColorPickerField` (famílias, busca, max 5) |

- Campos com `variant_dimension === 'color'` populam `availableColors`
- Campos com `variant_dimension === 'size'` populam `availableSizes`
- Campos `required: true` são marcados com asterisco e bloqueiam publicação

### 3 — Variantes e estoque (`sec-estoque`)

Exibida somente se `availableColors` ou `availableSizes` não estiverem vazios.

```
         P    M    G
Preto   [0]  [0]  [0]
Branco  [0]  [0]  [0]
```

- Só cores: lista por cor. Só tamanhos: lista por tamanho. Ambos: grid 2D.
- Stepper (`+` / `-`) por célula; bulk fill por linha (hover).
- Badge "Total X unidades" atualizado em tempo real.
- Se sem variantes: campo de estoque único (texto simples) na BasicInfoSection.
- Payload: `variant_stocks: [{color, size, stock}]`

### 4 — Imagens (`sec-imagens`)

**Modo com cores:** uma aba por cor de `availableColors`.
- Cada cor: mínimo 2, máximo 5 imagens.
- Drag-and-drop para reordenar dentro da aba.
- Badge de contagem por aba; badge "Principal" na posição 0.
- Aviso âmbar se a cor tiver imagens insuficientes.

**Modo simples (sem cores):** zona de upload única.
- Mínimo 2, máximo 5 imagens.
- Edição: imagens existentes exibidas com botão de remoção.

**Tipo de estado interno:**
```typescript
type OrderedImage =
  | { type: 'existing'; url: string }   // URL existente no backend
  | { type: 'new'; file: File }         // arquivo novo a ser enviado
```

### 5 — Especificações (`sec-specs`)

- Editor TipTap rich-text (barra de formatação: negrito, itálico, lista).
- Contador de caracteres (max 2000 em texto puro).
- Conteúdo salvo no campo `specifications` (HTML).

> **Dados fiscais (NCM, CEST, GTIN, Origem, Unidade) foram removidos do frontend e do backend.** Não há mais campos fiscais no formulário.

---

## Sidebar — CompletionMeter

5 itens de progresso, calculados por `computeCompletion()` em `completion.ts`:

| Item | Âncora | Obrigatório | Condição de conclusão |
|---|---|---|---|
| Informações básicas | `sec-basico` | Sim | nome ≥ 3 chars e preço > 0 |
| Tipo e nicho | `sec-nicho` | Sim | nicho + categoria + campos required preenchidos |
| Variantes e estoque | `sec-estoque` | Não | estoque total > 0 |
| Imagens | `sec-imagens` | Sim | 2–5 imagens por cor (ou 2–5 simples) |
| Especificações | `sec-specs` | Não | texto puro não-vazio |

- Anel SVG mostra % de itens obrigatórios concluídos.
- Clicar num item rola suavemente (`scrollIntoView`) até a âncora correspondente.

---

## Sidebar — PublishCard

### Modo criação

- Botão "Publicar" (primário): valida itens obrigatórios, submete com `save_as_draft=false`.
- Botão "Salvar rascunho" (ghost): submete sem validação de campos opcionais.
- Loaders independentes: `saving` e `savingDraft` evitam loader no botão errado.

### Modo edição

- Segmented control de status: **Rascunho** | **Ativo** | **Inativo**
  - Cada mudança dispara `PATCH /products/:id/status` imediatamente (sem aguardar o save).
  - Em caso de erro: status revertido ao anterior + toast de erro.
- Botão "Salvar alterações" (primário): submete `PATCH /products/:id`.
- O save **não altera** o status — apenas os dados do produto.

---

## Guard de navegação (`useUnsavedChanges`)

Intercepta qualquer tentativa de sair da página quando há alterações não salvas:
- `beforeunload` nativo (fechar aba / reload).
- Cliques em `<a>` internos.
- `router.push`, `router.back`, `router.replace`.

Exibe `ConfirmDialog` com opções "Sim, descartar" / "Continuar editando".

**Criação:** detecta mudança por `!!name || !!price || !!description || hasImages`.  
**Edição:** detecta por `formState.isDirty` (RHF) OU snapshot JSON do estado extra (imagens, variantes, nicho, campos dinâmicos).

---

## Payload da API

### Criar — `POST /products` (multipart/form-data, timeout 120s)

| Campo | Tipo | Notas |
|---|---|---|
| `name` | string | obrigatório |
| `price` | string | decimal como string |
| `stock` | string | soma das variantes ou estoque único |
| `category_id` | string | opcional |
| `featured` | `'true'`/`'false'` | |
| `save_as_draft` | `'true'` | omitido se publicar |
| `description` | string | HTML |
| `specifications` | string | HTML |
| `promo_price` | string | opcional |
| `promo_starts_at` | string | ISO datetime |
| `promo_ends_at` | string | ISO datetime |
| `niche_id` | string | sempre que nicho selecionado |
| `dynamic_fields` | JSON string | `[{field_id: number, value: string}]` |
| `variant_stocks` | JSON string | `[{color, size, stock}]` |
| `images` | File[] | todos os arquivos novos |
| `images_by_color` | JSON string | `{[cor]: [índices em images]}` |

> `dynamic_fields` usa `field_id` (número), **não** slug.

### Editar — `PATCH /products/:id` (multipart/form-data, timeout 120s)

Mesmo payload, sem `save_as_draft`. Campos adicionais:

| Campo | Tipo | Notas |
|---|---|---|
| `existing_images_order` | JSON string | `{[cor]: [urls existentes em ordem]}` — URLs omitidas são removidas |
| `remove_images[]` | string[] | índices de imagens simples a remover (modo sem cor) |

### Alterar status — `PATCH /products/:id/status`

```json
{ "status": 0 }   // 0 = inativo, 1 = ativo, 2 = rascunho
```

O endpoint aceita `status` no body. Se omitido, faz toggle.

---

## Validações frontend (Yup — `productSchemas.ts`)

- `name`: obrigatório, 3–200 chars
- `price`: obrigatório, > 0
- `stock`: ≥ 0
- `promo_price`: se presente, deve ser < `price`
- `promo_starts_at` / `promo_ends_at`: obrigatórios se `promo_price` preenchido

Validações fora do Yup (no hook, antes de montar o FormData):
- Cada cor: 2–5 imagens
- Modo simples: 2–5 imagens (existentes remanescentes + novas)

---

## Estados de carregamento

| Situação | Comportamento |
|---|---|
| Submit em curso | `NxButton loading={true}`; botão oposto `disabled` |
| Carregando produto (edit) | `<LoadingPage />` até `isInitialized === true` |
| Produto não encontrado | `<ErrorState message="Produto não encontrado" />` |
| Erro de API | `showError(message, título)` via `ToastContext` |
| Alteração de status com erro | Toast de erro + rollback do segmented control |

---

## Listagem de produtos (`/vendedor/produtos`)

Arquivo: `src/app/vendedor/produtos/page.tsx`

### Layout

```
[Header: título + botão "+ Novo produto"]
[KPI cards: Total | Ativos | Destaque | Inativos]
[Filtros: busca + status + ordenação]
[Grid de cards de produto]
[Paginação]
```

### KPI cards

| Card | Dado |
|---|---|
| Total de produtos | `stats.total` |
| Ativos | `stats.total_active` (status = 1) |
| Em destaque | `stats.total_featured` |
| Em estoque | `stats.total_in_stock` |

### Card de produto

- Imagem com hover (2ª imagem no hover)
- Nome truncado (`line-clamp-2`)
- Preço com badge de desconto (%) em `nxa` se houver `promo_price`
- Badge "Destaque" em `nxp`; badge "Rascunho" em `nxi3`
- Toggle ativo/inativo diretamente no card
- Context menu: Editar, Duplicar, Ativar/Desativar

### Filtros

- Busca por nome: debounce 300ms
- Status: Todos | Ativos | Inativos | Rascunhos
- Ordenação: Mais recentes | Preço ↑ | Preço ↓ | Nome A-Z

---

## Referências de código

| Responsabilidade | Arquivo |
|---|---|
| Construção do FormData | `src/components/ProductForm/buildProductFormData.ts` |
| Estado compartilhado (imagens, nicho, variantes) | `src/components/ProductForm/useSharedProductState.ts` |
| Cache de object URLs + buildPreviewData | `src/components/ProductForm/previewUtils.ts` |
| Guard de navegação (unsaved changes) | `src/hooks/useUnsavedChanges.ts` |
| Progresso de conclusão | `src/components/ProductForm/completion.ts` |
| Primitivos de UI | `src/components/ProductForm/primitives.tsx` |
| Hook de criação | `src/app/vendedor/produtos/criar/useCreateProductPage.ts` |
| Hook de edição | `src/app/vendedor/produtos/editar/[id]/useEditProductPage.ts` |
| DTO backend | `loja-virtual/src/products/dto/create-product.dto.ts` |
| Controller de status | `loja-virtual/src/products/products.controller.ts` — `PATCH /:id/status` |
