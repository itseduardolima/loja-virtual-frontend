# PLANO — Redesign da tela de Pedidos (Vendedor)

> Implementação fiel ao Claude Design `Pedidos.dc.html`.
> Fonte de verdade visual: **`.specs/Pedidos.design.html`** (cópia local do design; markup + lógica `DCLogic`).
> Alvo: `/vendedor/pedidos`. Complementa `DESIGN_SPEC.md` e atualiza `SPEC_pedidos.md`.

---

## 0. O que o design entrega

Tela híbrida **Lista (padrão) ↔ Quadro (Kanban)** com KPIs, filtros e **drawer de detalhe em overlay (480px)** compartilhado pelas duas views. O design usa **exatamente os tokens nx\*** (`--nxp:#2A2D7C`, `--nxi1/2/3`, `--nxborder`, `--nxbg`, `--nxsurf`, `--nxd`, `--nxs`, `--nxa`, `--nxw`) — mapeia direto pro Tailwind do projeto. Fonte: **Nunito** (já é a `font-sans`).

O arquivo tem 2 partes:
- **Tela viva** (linhas ~56–466): markup canônico de cada componente.
- **Catálogo de estados A–K** (linhas ~468–938): cada estado isolado e rotulado.
- **Lógica `DCLogic`** (linhas ~945–1230): state machine, seed, view-models (`vmRow`, `vmCard`, `vmSelected`), `statusMeta`, `timeline`, `filtered`, ações.

---

## 1. Decisões-chave (com recomendação — confirmar antes da Etapa 0)

| # | Tema | Decisão recomendada | Por quê |
|---|------|---------------------|---------|
| D1 | **Rename de status** | O design renomeia **1 = "Novo"** (era Pendente) e **2 = "Em preparação"** (era Confirmado); 3 Enviado, 4 Entregue, 5 Cancelado. Aplicar como **labels só do vendedor**, num módulo novo `orderVendorMeta.ts`. **Não** alterar o `ORDER_STATUS` global. | Códigos 1–5 do backend ficam iguais. Evita quebrar telas do cliente (rastreio, loja pública) que usam `ORDER_STATUS`. |
| D2 | **Paleta de status** | O design usa paleta própria por status (âmbar/azul/violeta/verde/rosa, hexes específicos: `#E8A33D`, `#2F6FE0`, `#7C5CD6`, `#3F8A66`, `#D6456A` + fg/bg/ring). Centralizar em `orderVendorMeta.ts` e usar valores arbitrários Tailwind (`bg-[#FBF3E0]` etc.). | Exceção já documentada no `SPEC_pedidos.md` (kanban usa cor direta). Fidelidade 100%. |
| D3 | **KPIs** | Sem endpoint/hook de stats. Calcular **Novos/Em andamento/Cancelados/Receita** a partir do conjunto carregado e **Total** de `meta.total`. (Opcional futuro: hook `/orders/stats`.) | Espelha o que o design faz (client-side). Sem dependência de backend novo. |
| D4 | **Drag-and-drop do Quadro** | Manter **@dnd-kit** (já integrado) e reproduzir só os **visuais** do design (card arrastado em `opacity:.45`, coluna-alvo destacada, placeholder "Solte aqui"). | Melhor UX/acessibilidade que o `draggable` nativo do mock. Fidelidade visual preservada. |
| D5 | **Drawer** | Trocar o painel lateral fixo atual pelo **drawer em overlay 480px** com scrim, animação `nxdrawer`, tabs em pílula. | É o que o design especifica. |
| D6 | **Dados (lista/quadro)** | Manter o padrão "painel" atual (`useOrders` carrega ~100 recentes; filtro/sort/agrupamento client-side). Busca e período continuam indo pro servidor. | Interações instantâneas como no design, sem reescrever a camada de dados. |
| D7 | **Sidebar** | Não reimplementar — vem do `app/vendedor/layout.tsx`. Só adicionar o **badge de não-lidos** no item "Pedidos" do `SidebarVendedor`. | A sidebar do design é contexto. |

---

## 2. Mapa de arquivos

### Novos
- `src/lib/orderVendorMeta.ts` — **fundação**: `STATUS_META` (label/fg/bg/ring/dot por status), `advanceLabel`, agrupamentos de KPI, `dateShort`/`dateFull`, e os **tipos de view-model** (`OrderRowVM`, `OrderCardVM`, `OrderDetailVM`, `StatusTab`, `KpiData`). Reusa `formatPrice`, `relativeTimeOrder`, `getInitials`.
- `src/components/Order/OrderKpis.tsx` — 5 KPIs (normal / shimmer / zerados).
- `src/components/Order/OrdersFilterBar.tsx` — busca, ordenação (dropdown), período, segments de status, toggle Lista/Quadro, botão Exportar (3 estados).
- `src/components/Order/OrderListView.tsx` — tabela: header ordenável + linhas (todas as variações) + vazio-filtrado.
- `src/components/Order/OrderBoardView.tsx` — 4 colunas + banner "Cancelados fora do fluxo".
- `src/components/Order/OrderDetailDrawer.tsx` — overlay + painel 480px + header + alerta cancelamento + tabs + footer + estados loading/erro (hospeda as 4 abas).
- `src/components/Order/CancelReasonModal.tsx` — motivo do cancelamento (textarea 0/500, confirmar desabilitado se vazio).
- `src/components/Order/CancellationRequestModal.tsx` — solicitação do cliente (aceitar/recusar, com/sem motivo, loading).
- `src/components/Order/OrderEmptyStates.tsx` — A1 carregando (skeleton), A2 vazio absoluto, A3 vazio filtrado, A4 erro.
- `src/components/Order/NewOrderToast.tsx` — toast de novo pedido (tempo real).

### Refatorados
- `src/components/Order/OrderKanbanCard.tsx` — card rico novo (código + total, nome, itens/tempo, chip de cancelamento, ponto não-lido, estados arrastando/selecionado).
- `src/components/Order/KanbanColumn.tsx` — coluna nova (header com dot/label/contagem, dropzone destacada, "Ver mais N", coluna vazia).
- `src/components/Order/OrderTrackingTimeline.tsx` — timeline vertical (dots/linhas, atual destacado, ramo de cancelamento).
- `src/components/Order/OrderDetailPanel.tsx` — vira o **conteúdo das abas** (Resumo/Itens/Cliente/Histórico) usado pelo `OrderDetailDrawer`.
- `src/components/Order/MobileOrdersView.tsx` — mobile novo (KPIs compactos, segments com scroll, cards, drawer em bottom sheet).
- `src/components/Order/index.ts` — barrel.
- `src/app/vendedor/pedidos/page.tsx` — montagem + fiação (só JSX limpo).
- `src/app/vendedor/pedidos/useOrdersPage.ts` — view (list/board), sort, statusFilter, KPIs, view-models, hooks reais.
- `src/app/vendedor/pedidos/loading.tsx` — skeleton alinhado ao A1.
- `src/lib/orderPanelUtils.ts` — manter `STATUS_FLOW`/helpers de WhatsApp/endereço; status meta migra pra `orderVendorMeta.ts`.
- `src/components/Layout/SidebarVendedor.tsx` — badge de não-lidos no item "Pedidos" (D7).

---

## 3. Etapas e agentes

### Etapa 0 — Fundações (solo, primeiro, sem paralelismo)
Criar `src/lib/orderVendorMeta.ts` com `STATUS_META`, `advanceLabel`, KPIs e **todos os tipos de view-model** (contratos que os componentes da Etapa 1 vão consumir). Definir a estrutura de props de cada componente. Saída: contrato estável → desbloqueia o paralelismo.
> Refs no design: `statusMeta` (≈981–987), `vmRow/vmCard/vmSelected` (≈1000–1088), `timeline` (≈1089–1114).

### Etapa 1 — Componentes apresentacionais (6 agentes em paralelo)
Cada agente recebe: faixas de linha exatas do `.specs/Pedidos.design.html`, o módulo `orderVendorMeta.ts`, as regras de fidelidade (§5) e o contrato de props. **Componentes "burros" (recebem view-model via props)** — fiação de dados fica pra Etapa 2. Arquivos disjuntos (sem conflito).

| Agente | Arquivos (dono exclusivo) | Refs no design |
|---|---|---|
| **A · Lista** | `OrderListView.tsx` | List 171–217; D (linhas) 635–707 |
| **B · Quadro** | `OrderBoardView.tsx`, `OrderKanbanCard.tsx`, `KanbanColumn.tsx` | Board 219–262; E (cards) 709–766 |
| **C · Drawer** | `OrderDetailDrawer.tsx`, `OrderDetailPanel.tsx`, `OrderTrackingTimeline.tsx` | Drawer 268–427; F 768–796 |
| **D · Filtros+KPIs** | `OrdersFilterBar.tsx`, `OrderKpis.tsx` | Header/KPIs 91–166; B 530–566; C 568–633; G 798–806 |
| **E · Estados+Modais+Toast** | `OrderEmptyStates.tsx`, `CancelReasonModal.tsx`, `CancellationRequestModal.tsx`, `NewOrderToast.tsx` | A 477–528; modais 429–455; I 837–872; toast 457–464; J 874–889 |
| **F · Mobile** | `MobileOrdersView.tsx` | K 891–938 |

### Etapa 2 — Integração + dados reais (solo)
Reescrever `page.tsx` + `useOrdersPage.ts`: montar os componentes, gerar os view-models e ligar aos hooks reais (§4). Tratar loading/empty/erro reais, KPIs, status labels, DnD (@dnd-kit) e o overlay do drawer.

### Etapa 3 — Mobile/responsivo (junto com F + ajuste fino na integração)
Split atual mantido: `lg+` usa Lista/Quadro + drawer overlay; `< lg` usa `MobileOrdersView` + bottom sheet.

### Etapa 4 — Verificação (solo)
`pnpm lint` + `pnpm build`; comparar cada estado A–K com o catálogo; corrigir divergências; checar que nenhuma tela do cliente quebrou com o rename (D1).

---

## 4. Mapa de dados (design → hooks reais)

| Ação no design | Hook/endpoint real |
|---|---|
| Lista de pedidos | `useOrders({ limit:100, sort, search, date_from, date_to })` → filtro/sort client-side (`filtered`) |
| KPIs | `meta.total` + contagens/receita do conjunto carregado |
| Abrir pedido + marcar lido | `setSelectedOrderId` + `useMarkOrderAsRead` |
| Detalhe (drawer) | `useOrderDetail(selectedId)` |
| Avançar status | `useUpdateOrderStatus({ orderId, status: next })` |
| Cancelar (motivo) | `useUpdateOrderStatus({ status:5, cancellation_reason })` |
| Aceitar/recusar cancelamento | `useAcceptCancellationRequest` / `useDenyCancellationRequest` |
| Exportar Excel | `useExportOrders` + `usePlanFeatures` + `useFeatureLockedModal` |
| Mover no Quadro (DnD) | @dnd-kit → `useUpdateOrderStatus` |
| Toast tempo real | `useOrderNotifications` (socket) → `NewOrderToast` + invalidate `['orders']` |

---

## 5. Regras de fidelidade

- **Tokens nx\*** onde o hex bate (`#2A2D7C`→`nxp`, `#1C1E2B`→`nxi1`, `#4A4D5E`→`nxi2`, `#8A8D9E`→`nxi3`, `#E6E7EE`→`nxborder`, `#F3F4F8`→`nxbg`, `#FBFAF7`→`nxsurf`, `#C13A2E`→`nxd`, `#3F8A66`→`nxs`, `#E8632A`→`nxa`, `#E8A33D`→`nxw`).
- **Paleta de status** e demais hexes pontuais → valores arbitrários Tailwind, centralizados em `orderVendorMeta.ts`.
- **Tailwind, sem `style=` inline** (padrão do projeto). Tamanhos em px arbitrários (`text-[13px]`, `h-[40px]`, `rounded-[14px]`) batendo o design.
- **Lucide React** para todos os ícones (nomes do design: `list`, `layout-grid`, `download`, `search`, `arrow-up-down`, `calendar`, `package`, `clock`, `truck`, `circle-x`, `trending-up`, `file-text`, `alert-triangle`, `ticket-percent`, `message-circle`, `arrow-right`, `map-pin`, `phone`/`phone-off`, `mail`, `printer`, `copy`/`check`, `bell`, `lock`, `cloud-off`, `refresh-cw`, `search-x`, `image-off`, `shopping-bag`).
- `font-variant-numeric: tabular-nums` em códigos/valores; `letter-spacing` negativo nos títulos.
- Pages limpas (só JSX), SVGs próprios em `src/assets/icons/` se necessário, `router.push()` em vez de `window.location.href`.

---

## 6. Checklist de estados (A–K) — todos devem existir

- **A** página: carregando (skeleton) · vazio absoluto · vazio filtrado · erro
- **B** KPIs: normal · shimmer · zerados
- **C** filtros: toggle (2) · busca (vazia/preenchida) · ordenação (menu) · período (on/off) · export (normal/exportando/travado) · segments
- **D** linha lista: normal · não-lido · cancelamento · cupom · hover · selecionada
- **E** card quadro: rico · não-lido · cancelamento · arrastando+alvo · selecionado · coluna vazia/ver mais
- **F** drawer: carregando · erro · alerta de cancelamento + abas Resumo/Itens/Cliente/Histórico
- **G** badges: 5 status
- **I** modais: solicitação (com/sem motivo, loading) · motivo lojista (vazio/preenchido) · plano travado
- **J** tempo real: toast · badge sidebar
- **K** responsivo: mobile (lista+filtros) · bottom sheet · tablet

---

*Plano gerado a partir do design `Pedidos.dc.html` e do código atual. Executar Etapa 0 → 1 (paralelo) → 2 → 3 → 4.*
