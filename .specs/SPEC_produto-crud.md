# SPEC — Produto CRUD (Criar / Editar)

> Spec de feature. Complementa `DESIGN_SPEC.md` — seguir todos os tokens, tipografia e componentes definidos lá.

---

## Visão geral

O cadastro de produto é um **wizard multi-step** com 4 etapas sequenciais. O mesmo layout é usado em criação (`/vendedor/produtos/criar`) e edição (`/vendedor/produtos/editar/[id]`), com diferença apenas na carga inicial de dados e no endpoint chamado.

**Arquivos principais:**
- `src/app/vendedor/produtos/criar/page.tsx` + `useCreateProductPage.ts`
- `src/app/vendedor/produtos/editar/[id]/page.tsx` + `useEditProductPage.ts`
- `src/components/Form/ProductSteps.tsx` — componente de navegação entre etapas
- `src/components/Form/DynamicFields.tsx` — campos dinâmicos por nicho
- `src/components/Form/ImageUploadByColor.tsx` — upload de imagens agrupadas por cor

---

## Estrutura do wizard

### Etapas

| # | Título real no código | Conteúdo |
|---|---|---|
| 1 | Informações básicas | Nome, descrição, preço, preço promocional, destaque, rascunho |
| 2 | Tipo de Produto | Categoria, nicho, `DynamicFields` do nicho, estoque por variante (grid cor × tamanho) |
| 3 | Imagens | `ImageUploadByColor` (se produto tem cores) ou `ImageUpload` simples |
| 4 | Especificações | Editor rich-text para especificações técnicas + dados fiscais NF-e (`<details>` colapsável) |

> **Atenção:** Etapa 2 agrupa seleção de nicho/categoria, campos dinâmicos e estoque por variante em uma única tela. Etapa 4 não é uma tela de revisão — é o editor de especificações. Não há tela de resumo/revisão no fluxo atual.

### Navegação entre etapas (`ProductSteps.tsx`)

```tsx
<ProductSteps currentStep={step} totalSteps={4} onStepClick={goToStep} />
```

- Exibir progresso visual: círculo numerado ou barra.
- Etapas anteriores são clicáveis (permite voltar).
- Etapa atual: destaque `nxp`.
- Etapas futuras: cinza `nxi3`, não clicáveis.
- Botões "Anterior" / "Próximo" ao rodapé de cada etapa.
- Última etapa: botão "Salvar produto" (`NxButton loading={isSaving}`).

---

## Etapa 1 — Informações básicas

### Campos obrigatórios

| Campo | Tipo | Notas |
|---|---|---|
| Nome | text | min 3, max 200 chars |
| Preço | number (R$) | Decimal 10,2 |
| Estoque | number | inteiro ≥ 0 |

### Campos opcionais

| Campo | Tipo | Notas |
|---|---|---|
| Descrição | textarea (rich text TipTap) | HTML sanitizado |
| Especificações | textarea (rich text TipTap) | HTML sanitizado |
| Categoria | select | lista das categorias da loja |
| Nicho | select/radio | define os campos da etapa 2 |
| Preço promocional | number (R$) | exige `promo_starts_at` + `promo_ends_at` |
| Produto em destaque | toggle |  |
| Salvar como rascunho | toggle | status = 2, não aparece na vitrine |

### Dados fiscais (Bling / NF-e) — collapsible

Exibir em seção colapsável "Dados fiscais (NF-e)" com `ToggleRow`:

| Campo | Tipo | Notas |
|---|---|---|
| NCM | text | 8 dígitos, máscara |
| CEST | text | 7 dígitos, opcional |
| GTIN (EAN) | text | 14 chars |
| Origem | select | 0–8 (tabela ICMS) |
| Unidade | select | UN, KG, PC, M, M2, L |

---

## Etapa 2 — Tipo de Produto

Esta etapa contém três seções em sequência:

### 2a. Seleção de categoria e nicho
- Select de categoria (lista das categorias da loja; botão "Nova categoria" inline)
- Select/radio de nicho → carrega `DynamicFields` ao mudar

### 2b. Campos dinâmicos do nicho (`DynamicFields`)
- Se nenhum nicho selecionado: `Notice variant="amber"` orientando selecionar primeiro
- Campos `required: true` devem bloquear avanço se vazios (borda `nxd`)

| `field_type` | UX |
|---|---|
| `text` | `<input>` simples |
| `textarea` | `<textarea>` 3 linhas |
| `number` | `<input type="number">` |
| `select` | Multi-select com checkboxes (array de valores) |
| `radio` | Pills de escolha única (valor string) |
| `color` | Grid de bolinhas coloridas com paleta `COLOR_OPTIONS`; cores normalizadas lowercase; ordenadas por família/luminosidade |

Campos com `variant_dimension === 'color'` alimentam `availableColors`; `variant_dimension === 'size'` alimentam `availableSizes`.

### 2c. Estoque por variante
Exibido ao final da etapa 2 (não em etapa separada):

```
Cor × Tamanho  → input de quantidade
Preto × P      → [  0 ]
Preto × M      → [  0 ]
Branco × P     → [  0 ]
```

- Se só cores: lista por cor. Se só tamanhos: lista por tamanho. Se ambos: grid 2D.
- Payload: `variant_stocks: [{color, size, stock}]`

---

## Etapa 3 — Imagens por cor

Componente: `ImageUploadByColor`.

- Uma aba por cor de `availableColors`.
- Cada cor: mínimo 2, máximo 5 imagens.
- Upload por drag-and-drop ou clique.
- Preview com reordenação.
- Imagem na posição 0 é a capa da cor.
- Ao editar: imagens existentes são exibidas; novas são appended no multipart.

Payload gerado:
- `images`: array de arquivos File
- `images_by_color`: JSON `{[cor]: [índices do array images]}`

---

## Etapa 4 — Especificações

- Editor rich-text (TipTap) para especificações técnicas detalhadas do produto
- Seção colapsável "Dados fiscais (NF-e)" via `<details>` HTML nativo (não `ToggleRow`):

| Campo | Tipo | Notas |
|---|---|---|
| NCM | text | 8 dígitos |
| CEST | text | 7 dígitos, opcional |
| GTIN (EAN) | text | 14 chars |
| Origem | select | 0–8 (tabela ICMS) |
| Unidade | select | UN, KG, PC, M, M2, L |

- Seção fiscal auto-expande se o vendedor tiver Bling conectado
- Botões finais: "Salvar rascunho" e "Publicar" (não há tela de revisão/resumo)

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

4 cards no padrão do design system:
- Total de produtos
- Ativos (status = 1)
- Em destaque (featured = 1)
- Inativos/Rascunhos (status = 0 ou 2)

### Card de produto (`ProductCard.tsx`)

- Imagem com hover (2ª imagem aparece no hover)
- Nome truncado (max ~30 chars, `line-clamp-2`)
- Preço com destaque se houver `promo_price`
- Badge de desconto (%) em `nxa`
- Badge "Destaque" em `nxp`
- Badge "Rascunho" em `nxi3`
- Status toggle (ativo/inativo) diretamente no card
- Context menu: Editar, Duplicar, Ativar/Desativar

### Filtros

- Busca por nome: `SearchInput` com debounce 300ms
- Status: Todos | Ativos | Inativos | Rascunhos
- Ordenação: Mais recentes | Preço ↑ | Preço ↓ | Nome A-Z

### Estado vazio

```
Ícone Package (lucide, 48px, nxi3)
"Nenhum produto ainda"
"Crie seu primeiro produto para começar a vender."
[Botão "+ Criar produto"]
```

---

## Payload da API

### Criar produto — `POST /products` (multipart/form-data)

Campos obrigatórios:
- `name`, `price`, `images` (arquivos), `images_by_color` (JSON)

Campos opcionais relevantes:
- `description`, `stock`, `category_id`, `niche_id`
- `dynamic_fields` (JSON array `[{field_id, value}]`)
- `variant_stocks` (JSON array `[{color, size, stock}]`)
- `save_as_draft` (boolean)
- `ncm`, `cest`, `gtin`, `origem`, `unidade`

### Editar produto — `PATCH /products/:id` (multipart/form-data)

Mesmo payload, adicional:
- `existing_images_order` (JSON — quais URLs existentes manter e em que ordem)

---

---

## Validações frontend (Yup)

- `name`: obrigatório, 3–200 chars
- `price`: obrigatório, > 0
- `stock`: ≥ 0
- `promo_price`: se presente, deve ser < `price`
- `promo_starts_at` / `promo_ends_at`: ambos obrigatórios se `promo_price` preenchido
- Campos `required: true` do nicho: verificar antes de avançar da etapa 2

---

## Estados de carregamento e erro

- Submit: `NxButton loading={isSaving}` + campos bloqueados
- Erro de API: `Notice variant="error"` acima do formulário
- Upload de imagem: spinner overlay por imagem
- Carregamento de categorias/nicho: skeleton nos selects

---

## Referências de código

| Padrão | Arquivo |
|---|---|
| Wizard / steps | `src/components/Form/ProductSteps.tsx` |
| Campos dinâmicos | `src/components/Form/DynamicFields.tsx` |
| Upload por cor | `src/components/Form/ImageUploadByColor.tsx` |
| Hook de criação | `src/app/vendedor/produtos/criar/useCreateProductPage.ts` |
| Hook de edição | `src/app/vendedor/produtos/editar/[id]/useEditProductPage.ts` |
| Primitivos de form | `src/app/vendedor/configuracoes/_shared.tsx` |
| DTO backend | `src/products/dto/create-product.dto.ts` |
