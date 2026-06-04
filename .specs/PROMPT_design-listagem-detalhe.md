# Prompt — Design Spec: Listagem e Detalhe de Produto (Vendedor + Cliente)

> Cole este prompt numa conversa com Claude para gerar as specs de design das páginas.
> Referência do nível de qualidade esperado: SPEC_produto-crud.md (redesign do form de criar/editar produto).

---

## Contexto do projeto

Você está redesenhando páginas de um SaaS de e-commerce chamado **Nexo**. É uma plataforma multi-tenant onde vendedores criam lojas virtuais.

**Stack:**
- Next.js 14 App Router, React 18, TypeScript 5
- Tailwind CSS + shadcn/ui (Radix UI)
- Framer Motion (usar com moderação — não animar tudo)
- Lucide React (ícones — único)
- TanStack React Query v5

**Design System (obrigatório — não inventar cores ou tamanhos):**

Tokens de cor:
- `nxp` — Indigo `#2A2D7C` — primário, brand, ações principais
- `nxa` — Laranja `#E8632A` — destaque, CTAs secundários, badges novos
- `nxs` — Verde `#3F8A66` — sucesso, status positivo
- `nxw` — Âmbar `#E8A33D` — aviso, atenção
- `nxd` — Vermelho `#C13A2E` — erro, destrutivo
- `nxsurf` — Off-white `#FBFAF7` — superfície de cards
- `nxbg` — Cinza claro `#F3F4F8` — fundo de página
- `nxi1` — Tinta forte — títulos, labels
- `nxi2` — Tinta média — corpo de texto
- `nxi3` — Tinta suave — placeholders, metadados
- `nxborder` — Borda padrão de cards e inputs

**Proibido:** usar `gray-*`, `blue-*`, `green-*`, `red-*` — sempre tokens `nx*`.

Tipografia:
- Título de página: `text-[26px] font-extrabold tracking-[-0.03em] text-nxi1`
- Título de seção: `text-base font-bold tracking-[-0.01em] text-nxi1`
- Corpo: `text-[13px] font-medium text-nxi2`
- Metadado: `text-[11.5px] text-nxi3`
- Badge: `text-[10.5px] font-bold uppercase tracking-[0.04em]`

Badge semântico:
```
rounded-full bg-{token}/[0.06] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.04em] text-{token} ring-1 ring-inset ring-{token}/15
```

Card base:
```
rounded-2xl border border-nxborder bg-white shadow-[0_1px_2px_hsl(0_0%_0%/0.04)] p-5 md:p-6
```

Botão primário: `NxButton` (primitivo do projeto, não shadcn Button).

**Referência de qualidade:** o redesign do formulário de criar/editar produto usou este design system e produziu um layout no estilo Shopify — sidebar sticky, seções ancoradas, CompletionMeter com anel SVG. O nível de profissionalismo esperado é o mesmo.

---

## Páginas a redesenhar

### PÁGINA 1 — Listagem de produtos (painel do vendedor)
Rota: `/vendedor/produtos`  
Arquivo atual: `src/app/vendedor/produtos/page.tsx`

**Problemas do estado atual (para você corrigir no design):**
1. KPI cards com cores hardcoded (`bg-blue-50 border-blue-400 text-blue-700`) — visual de template gratuito.
2. O componente `ProductCard` usado aqui é o componente de **vitrine do cliente** (tem lógica de wishlist, hover de carrinho, etc.) — não faz sentido no contexto do painel admin.
3. Menu de 3 pontos (Editar / Duplicar / Ativar/Desativar) é hand-rolled com `openMenuId` state e `useEffect` — precisa ser `DropdownMenu` do shadcn.
4. Usa `Button` genérico do shadcn e cores `text-gray-900` — inconsistente com o painel do vendedor.

**Dados disponíveis no estado atual:**
- `stats`: `{ total, active, featured, inactive }`
- `products[]`: `{ id, name, price, promo_price, status (0=inativo,1=ativo,2=rascunho), featured, images[], stock }`
- Filtros: busca por nome (debounce 300ms), status (Todos/Ativo/Inativo/Rascunho), ordenação (Mais recentes, Mais antigos, Menor preço, Maior preço, Em destaque)
- Ações por produto: Editar, Duplicar, Ativar/Desativar

**O que o design deve especificar:**
- Layout completo da página (header, KPI cards, filtros, grid de cards, paginação, estado vazio)
- Design do **card de produto para o contexto admin** — diferente do card da vitrine. Deve mostrar: imagem principal, nome, preço, badge de status, badge "Destaque" se aplicável, toggle ativo/inativo, menu de ações contextual.
- Design dos KPI cards usando tokens Nexo (não cores hardcoded)
- Como o `DropdownMenu` deve aparecer no card (posição, itens, ícones)
- Estado vazio (sem produtos / sem resultados de busca)

---

### PÁGINA 2 — Detalhe de produto (painel do vendedor)
Rota: `/vendedor/produtos/[id]`  
Arquivo atual: `src/app/vendedor/produtos/[id]/page.tsx`

**Problema fundamental:** a página atual é uma réplica da vitrine do cliente com botões de "Editar" e "Deletar" colados em cima. O vendedor não precisa ver o produto como um comprador — ele precisa de uma visão operacional.

**Dados disponíveis:**
- `product`: nome, preço, promo_price, status, featured, stock, description, specifications, images[], images_by_color{}, stock_variants[], dynamic_fields[], average_rating, total_reviews, category
- Funcionalidades existentes: reordenação de imagens por cor (drag-and-drop), ativar/desativar, editar (redireciona para /editar/[id]), excluir

**O que o design deve especificar:**
- Layout da página — pensar como uma página de **gestão de produto**, não vitrine. Sugestão: grid de 2 colunas (imagens + info + ações) no topo, seções de dados abaixo.
- Seção de imagens: galeria compacta com modo de reordenação.
- Seção de informações principais: nome, status (badge), destaque (badge), preço / preço promocional, estoque total.
- Seção de variantes/estoque: tabela de `stock_variants` (cor × tamanho × estoque) se houver variantes.
- Seção de avaliações: resumo (rating médio + total de avaliações) — sem a lista completa, só o sumário com link.
- Ações: botão "Editar produto" (principal), menu com "Duplicar", "Excluir" (destrutivo), toggle de status.
- Breadcrumb: Produtos → [nome do produto]
- Sem reinventar a galeria de imagens do cliente — criar uma galeria admin mais simples e funcional.

---

### PÁGINA 3 — Listagem de produtos da loja (visão do cliente)
Rota: `/loja/[slug]/produtos`  
Arquivo atual: `src/app/loja/[slug]/produtos/page.tsx`

**Problemas do estado atual:**
1. `StoreSidebar` está duplicado no JSX: uma vez no drawer mobile (Framer Motion) e outra no desktop — mesmas props, copy-paste.
2. Detecção de mobile via `useState + useEffect + window.innerWidth` — deve ser CSS responsivo com Tailwind.
3. Animações Framer Motion em excesso: cada badge de filtro anima, o ícone de vazio entra com `rotate: -180 -> 0`, cada card tem stagger de `index * 0.05`. Exagerado para uma listagem.
4. Duplo check de `loading` (antes do return e dentro do JSX).
5. Lógica de `categoryNicheMap` dentro da page — pertence ao hook.
6. Fundo `bg-gray-50` hardcoded.

**Dados disponíveis:**
- `products[]`: lista paginada com "Carregar mais" (cursor-based)
- `filters`: `{ nicheId, categoryId, color, size, featured, minPrice, maxPrice }`
- `search`, `sort`, `sortField`
- StoreSidebar: sidebar de filtros (categorias, nichos, cores, tamanhos, faixa de preço, destaque)
- `storeInfo`: nome, logo, whatsapp, slug

**O que o design deve especificar:**
- Layout da página usando CSS responsivo (não JS para detectar mobile)
- Como o `StoreSidebar` deve se comportar em mobile vs desktop — **sem duplicar o componente** (usar CSS para mostrar/esconder, ou um componente Sheet/Drawer)
- Grid de produtos: quantas colunas em cada breakpoint
- Badges de filtros ativos: design limpo, animação sutil (não exagerada)
- Botão "Carregar mais"
- Estado vazio
- Breadcrumb: Início → [Categoria ou Nicho]
- Animações: especificar quais ficam e quais saem (princípio: animação só onde agrega)

---

### PÁGINA 4 — Detalhe de produto da loja (visão do cliente)
Rota: `/loja/[slug]/produto/[id]`  
Arquivo atual: `src/app/loja/[slug]/produto/[id]/page.tsx`

**Esta é a melhor das quatro — já foi componentizada corretamente.** Os componentes `ProductImageGallery`, `ProductRating`, `ProductPricing`, `ProductColorSelector`, `ProductSizeSelector`, `ProductAddToCart`, `ProductSpecsTab`, `ProductTabBar` já existem e funcionam bem.

**Problemas menores:**
1. Estoque exibido com `font-integral tracking-wide` — fonte de display misturada no meio de info de produto.
2. Descrição curta visível só no desktop (`hidden sm:block`) — em mobile o usuário não vê a descrição a não ser que abra a aba "Especificações".
3. A aba "Especificações" e "Avaliações" e "Perguntas" ficam numa seção separada abaixo do grid de produto. O tab bar não tem indicação visual de quantos itens há nas abas (apenas em "Avaliações" e "Perguntas").

**O que o design deve especificar:**
- Ajustes tipográficos (estoque, descrição mobile)
- Comportamento do tab bar (indicadores de contagem nas abas, aba ativa)
- Qualquer melhoria de layout no grid principal (imagem + info)
- Seção de produtos relacionados: já existe `RelatedProducts` — como deve aparecer (título, grid, número de produtos)

---

## Formato de output esperado

Para cada página, produza:

```
## [Nome da Página] — [rota]

### Visão geral do layout
[Diagrama ASCII do layout + descrição]

### Componentes novos necessários
[Lista de componentes a criar, com props principais]

### Componentes existentes reutilizados
[O que reaproveitar sem mudança]

### Especificações visuais
[Por seção: classes Tailwind exatas, tokens usados, comportamento responsivo]

### Interações e estados
[Hover, loading, vazio, erro, mobile vs desktop]

### O que REMOVER do código atual
[O que deve ser deletado/simplificado]
```

---

## Restrições obrigatórias

- **Zero cores genéricas Tailwind** nos novos designs — apenas tokens `nx*`
- **Zero duplicação de componentes** no JSX para mobile/desktop — usar CSS responsivo
- **Animações com critério** — só onde agrega percepção de qualidade, nunca por padrão
- **Painel do vendedor:** manter consistência com o form de criar/editar produto (mesmos tokens, mesma densidade, mesmo estilo de card)
- **Vitrine do cliente:** manter consistência com a página da loja (`/loja/[slug]`) já redesenhada (StoreHero, StoreCategoryPills, etc.)
- Para a Página 2 (detalhe vendedor): **não copiar o layout da vitrine do cliente** — criar um layout operacional/admin
- Cada componente novo deve ter nome no padrão PascalCase e localização sugerida em `src/components/`
