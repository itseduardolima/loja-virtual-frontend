# SPEC — Loja Pública (Vitrine do Comprador)

> Spec de feature. Complementa `DESIGN_SPEC.md`. Esta seção é pública (sem login), acessível em `/loja/[slug]/...`.

---

## Visão geral

A vitrine é o lado público do marketplace: cada loja tem sua própria URL (`/loja/[slug]`) com catálogo, detalhe de produto, carrinho e checkout. O design é independente do painel do vendedor — usa os mesmos tokens, mas a hierarquia visual é orientada à conversão, não à gestão.

**Rotas:**
```
/loja/[slug]                  → Home da loja
/loja/[slug]/produtos         → Listagem com filtros
/loja/[slug]/produto/[id]     → Detalhe do produto
/loja/[slug]/checkout         → Checkout
/loja/[slug]/pedido-sucesso   → Confirmação
```

---

## Layout global da loja (`layout.tsx`)

- Header fixo com logo da loja, nome, ícone do carrinho (badge de quantidade).
- Footer com redes sociais, métodos de pagamento aceitos, horário de funcionamento.
- Carrinho: `Sheet` lateral direito (sidebar), abre ao clicar no ícone.
- Botão flutuante do WhatsApp (se `store.whatsapp` configurado).

---

## Home da loja (`/loja/[slug]`)

### Estrutura

```
[Hero: banner da loja + logo + nome + descrição]
[Seção: Categorias em destaque]
[Seção: Produtos em destaque (featured = 1)]
[Seção: Produtos mais bem avaliados]
[Footer]
```

### Hero
- Banner: imagem full-width com gradiente overlay escuro (legibilidade do texto).
- Logo: 80×80px, `rounded-2xl`, borda branca, posicionado à esquerda sobreposto ao banner.
- Nome da loja: `text-[26px] font-extrabold tracking-[-0.03em]`.
- Descrição: `text-[13px] text-nxi2`.

### Seções de produto
- Grid `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4`.
- `ProductCard` em cada slot.
- Título de seção com link "Ver todos →" alinhado à direita.

---

## Listagem de produtos (`/loja/[slug]/produtos`)

### Layout desktop

```
[Header de página: breadcrumb + filtros ativos (badges)]
[grid-cols-[260px_1fr]]
  [Sidebar de filtros]     [Grid de produtos + paginação]
```

### Layout mobile

- Filtros em drawer (`Sheet`) acionado por botão "Filtros" no topo.
- Grid `grid-cols-2`.

### Sidebar de filtros (`StoreSidebar.tsx`)

Ordem dos blocos:

1. **Ordenação** — radio: Mais recentes | Menor preço | Maior preço | Mais avaliados
2. **Em destaque** — toggle
3. **Nicho** — radio (nichos da loja)
4. **Categoria** — radio (filtrado pelo nicho selecionado)
5. **Faixa de preço** — slider range com inputs de mín/máx
6. **Avaliação mínima** — estrelas clicáveis (1–5)
7. **Campos dinâmicos** — apenas `select` e `radio` com options, sem `variant_dimension`
   - Agrupados por nome (unifica campos de mesmo nome de nichos diferentes)
   - Cor usa grid de swatches coloridos (`getColorHex`)

Botão "Limpar filtros" no rodapé da sidebar.

### Filtros ativos (badges)

Exibidos abaixo do header, cada um com `×` para remover individualmente.

### Grid de produtos

- `ProductCard` responsivo
- Ao final: botão "Carregar mais" (paginação por cursor / offset)
- Estado vazio: ícone + mensagem + botão "Limpar filtros"

### Parâmetros de query (API)

```
GET /catalog/store/:slug/products
  ?page=&limit=&sort=&niche_id=&category_id=
  &min_price=&max_price=&min_rating=&featured=
  &dynamic_filters[campo]=valor
```

---

## Detalhe do produto (`/loja/[slug]/produto/[id]`)

### Layout

```
[Breadcrumb: Loja > Categoria > Nome do produto]

[grid-cols-1 lg:grid-cols-[1fr_420px]]
  [Galeria de imagens]     [Informações + ações]
```

### Galeria de imagens

- Imagem principal grande (aspect 1:1 em desktop, 4:3 em mobile).
- Thumbnails horizontais abaixo para navegar.
- Seletor de cor: ao trocar a cor, a galeria muda para as imagens da cor selecionada.
- Navegação por teclado (← →).
- Zoom no hover (desktop).

### Painel de informações

```
[Nome do produto — text-[22px] font-extrabold tracking-[-0.025em]]
[Rating stars + "(N avaliações)" link]
[Preço: R$ XXX,XX — se promoção: riscado + badge de desconto nxa]
[Seletor de Cor: swatches de bolinhas]
[Seletor de Tamanho: pills com estoque por variante]
[Quantidade: - [N] +]
[Botão "Adicionar ao carrinho" — NxButton primary, full width]
[Botão "Comprar agora" — NxButton ghost]
[Botão Wishlist + botão Compartilhar]
```

### Seletores de variante

- **Cor**: bolinhas coloridas via `getColorHex`. Cor sem estoque: opacidade 40% + cursor not-allowed.
- **Tamanho**: pills. Tamanho sem estoque para a cor selecionada: riscado, não selecionável.
- Estoque por variante: `GET /catalog/store/:slug/products/:id` → `stock_variants`.

### Abas de conteúdo

```
[Descrição] [Especificações] [Avaliações (N)] [Perguntas (N)]
```

**Descrição**: HTML sanitizado via `dompurify`.  
**Especificações**: campos dinâmicos do produto (`dynamic_fields`) em grid 2 colunas — label: valor.  
**Avaliações**: lista com avatar, nota (estrelas), comentário, imagens se houver. Paginada.  
**Perguntas**: perguntas respondidas pelo vendedor. Usuário logado pode fazer nova pergunta.

### Produtos relacionados

- Grid horizontal scrollável de `ProductCard` da mesma categoria.
- Título "Você também pode gostar".

---

## Carrinho (Sheet lateral)

Componente: `src/components/Cart/`

### Estrutura

```
[Header: "Carrinho (N itens)"]
[Lista de itens]
  - Thumbnail + nome + variantes (cor, tamanho)
  - Quantidade: - [N] + | Remover
  - Preço unitário × quantidade
[Divider]
[Resumo: Subtotal R$ XXX]
[Campo de cupom + botão "Aplicar"]
[Botão "Finalizar pedido" → /checkout]
```

- Carrinho persistido em `localStorage['cart-session-{storeId}']`.
- Sessão de carrinho sincronizada com `CART_SESSION` no backend.

---

## Checkout (`/loja/[slug]/checkout`)

### Layout desktop

```
[grid-cols-[1fr_380px]]
  [Formulário de dados + endereço]     [Resumo do pedido]
```

### Formulário

**Seção 1 — Seus dados**
- Nome completo (obrigatório)
- E-mail (obrigatório)
- Telefone com DDD (obrigatório)
- CPF ou CNPJ (obrigatório)
- Observações (textarea, opcional)

**Seção 2 — Endereço de entrega**

Se usuário logado: selecionar endereço salvo ou adicionar novo.  
Se guest: formulário completo de endereço com CEP auto-preenchimento.

```
CEP → [buscar]
Estado | Cidade
Logradouro | Número
Bairro | Complemento
```

### Resumo do pedido (coluna direita)

- Lista de itens com imagem, nome, variantes, quantidade, preço.
- Campo de cupom com feedback inline (válido = `nxs`, inválido = `nxd`).
- Subtotal, desconto do cupom, **total final**.
- Botão "Confirmar pedido" (`NxButton primary, full-width, loading`).

### Confirmação (`/loja/[slug]/pedido-sucesso`)

```
[Ícone de check animado — nxs]
"Pedido realizado com sucesso!"
[Código do pedido — bold, destaque]
[Resumo do pedido]
[Botão "Rastrear pedido" → /rastrear/:code]
[Botão "Continuar comprando" → /loja/[slug]/produtos]
```

E-mail de confirmação enviado automaticamente (template Handlebars via `EmailService`).

---

## Rastreamento de pedido (`/rastrear`)

Rota pública, sem slug de loja.

```
[Input: "Digite o código do pedido"]
[Botão "Rastrear"]

[Resultado:]
  Status atual com badge
  Timeline de status (ORDER_STATUS_HISTORY)
  Dados básicos: nome, total, data
```

Endpoint: `GET /catalog/track/:code` — público, sem autenticação.

---

## Endpoints consumidos

| Ação | Endpoint |
|---|---|
| Info da loja | `GET /catalog/store/:slug` |
| Categorias | `GET /catalog/store/:slug/categories` |
| Listagem de produtos | `GET /catalog/store/:slug/products` |
| Detalhe do produto | `GET /catalog/store/:slug/products/:id` |
| Avaliações do produto | `GET /catalog/store/:slug/products/:id/reviews` |
| Perguntas do produto | `GET /catalog/store/:slug/products/:id/questions` |
| Produtos mais avaliados | `GET /catalog/store/:slug/top-rated` |
| Criar pedido | `POST /cart` (carrinho) → `POST /orders` |
| Rastrear pedido | `GET /catalog/track/:code` |

---

## Performance

- Endpoints de catálogo têm cache no backend (`CacheInterceptor`):
  - Store info: 120s
  - Listagem: 30s
  - Detalhe: 60s
- Imagens: sempre `<Image>` do Next.js com `priority` para a imagem principal do produto.
- Paginação: offset (page + limit), sem cursor. Botão "Carregar mais" acumula resultados no state.
