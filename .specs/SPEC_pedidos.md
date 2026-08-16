# SPEC — Pedidos (Vendedor)

> Spec de feature. Complementa `DESIGN_SPEC.md`.
> Atualizada em 2026-06-18 após o redesign (Claude Design `Pedidos.dc.html`).
> Referências: `.specs/Pedidos.design.html` (design) e `.specs/PLANO_pedidos-redesign.md` (plano de implementação).

---

## Visão geral

O módulo permite ao vendedor acompanhar, filtrar e gerenciar todos os pedidos da loja. Acesso em `/vendedor/pedidos`.

A tela é **híbrida**: alterna entre **Lista** (tabela densa, padrão) e **Quadro** (Kanban com drag-and-drop) por um toggle no header, compartilhando KPIs, filtros e o **drawer de detalhe em overlay** entre as duas views.

**Arquivos principais:**
- `src/app/vendedor/pedidos/page.tsx` — montagem (só JSX)
- `src/app/vendedor/pedidos/useOrdersPage.ts` — estado, derivados e wiring dos hooks
- `src/lib/orderVendorMeta.ts` — **fundação**: rótulos/cores de status, KPIs, ordenação/filtro, formatadores
- `src/components/Order/*` — componentes (abaixo)

---

## Arquitetura de componentes (`src/components/Order/`)

| Componente | Papel |
|---|---|
| `OrderKpis` | 5 KPIs do topo (normal / shimmer / zerados) |
| `OrdersFilterBar` (+ `OrderViewToggle`, `OrderExportButton`) | Busca, ordenação, período, segmentos de status, toggle de view, exportar |
| `OrderListView` | Tabela densa ordenável (view Lista) |
| `OrderBoardView` + `KanbanColumn` + `OrderKanbanCard` | Kanban 4 colunas (view Quadro), drag-and-drop via `@dnd-kit` |
| `OrderDetailDrawer` | Overlay 480px (desktop): fetch + header + footer + abas |
| `OrderDetailPanel` | Conteúdo do drawer (header + alerta + abas Resumo/Itens/Cliente/Histórico); recebe `order` |
| `OrderVendorTimeline` | Timeline de status do drawer (não confundir com `OrderTrackingTimeline`, que é do cliente) |
| `OrderEmptyStates` | `OrdersLoadingState`, `OrdersEmptyState`, `OrdersFilteredEmptyState`, `OrdersErrorState` |
| `CancelReasonModal` | Motivo do cancelamento (lojista) |
| `CancellationRequestModal` | Solicitação de cancelamento do cliente (aceitar/recusar) |
| `NewOrderToast` | Toast de novo pedido (tempo real) |
| `MobileOrdersView` | View mobile (`< lg`): lista compacta + bottom sheet de detalhe |

> Componentes são **apresentacionais**: recebem dados/callbacks por props e consomem a fundação `orderVendorMeta`. Todo o wiring de dados/mutações fica em `useOrdersPage`.

---

## Status (rótulos e cores — visão do vendedor)

> ⚠️ Os **rótulos** abaixo são exclusivos do painel do vendedor (`orderVendorMeta`). Os códigos 1–5 do backend e o `ORDER_STATUS` global (usado nas telas do cliente) **não mudaram**.
> As **cores de status** são uma paleta própria (exceção documentada aos tokens `nx*`), centralizada como classes Tailwind literais em `orderVendorMeta.ts`.

| Código | Rótulo (vendedor) | Cor (dot) | Fluxo |
|---|---|---|---|
| 1 | **Novo** | âmbar `#E8A33D` | → 2 (Iniciar preparação) ou 5 (Cancelar) |
| 2 | **Em preparação** | azul `#2F6FE0` | → 3 (Marcar como enviado) ou 5 |
| 3 | **Enviado** | violeta `#7C5CD6` | → 4 (Marcar como entregue) ou 5 |
| 4 | **Entregue** | verde `#3F8A66` | — (final) |
| 5 | **Cancelado** | rosa `#D6456A` | — (final) |

Avançar é linear (1→2→3→4, `nextStatus`). Cancelar (→5) sempre passa pelo `CancelReasonModal` (motivo obrigatório).

---

## KPIs

5 cards (`OrderKpis`), calculados **client-side** a partir do conjunto carregado (não há endpoint de stats):

| Card | Fonte | Token |
|---|---|---|
| Total de pedidos | `meta.total` | `nxp` |
| Novos | contagem status 1 | `nxw` |
| Em andamento | status 2 + 3 | `nxs` |
| Cancelados | status 5 | `nxd` |
| Receita do período | soma dos não-cancelados | gradiente índigo |

---

## Filtros (header)

- **Busca** (`OrdersFilterBar`): client-side por código ou nome do cliente (instantânea).
- **Ordenação**: dropdown — mais recentes / mais antigos / maior valor / menor valor / cliente A–Z / Z–A (`OrderSortKey`).
- **Período**: botão toggle que aplica **últimos 7 dias** (`date_from`/`date_to` → servidor). *Simplificação: ainda não há date-picker de range completo.*
- **Status**: segmentos "Todos + 5 status" com contagem; aplica-se à Lista e ao Quadro.
- **Toggle de view**: Lista ↔ Quadro.

---

## View Lista (`OrderListView`)

Tabela densa, colunas: Código (mono) · Cliente · Itens · Total · Data (+ tempo relativo) · Status (badge) · Ações. Cabeçalhos Cliente/Total/Data são ordenáveis.

Variações de linha: normal · **não-lido** (barra/dot `nxa`, nome em peso 800) · **com solicitação de cancelamento** (chip laranja) · **com cupom** (chip verde) · hover · selecionada (`nxp`). Ações rápidas inline: avançar status (se aplicável) e WhatsApp.

---

## View Quadro (`OrderBoardView`)

4 colunas de fluxo (Novo, Em preparação, Enviado, Entregue). **Cancelados ficam fora do fluxo** (banner abaixo do quadro → "Ver cancelados" abre Lista com filtro status 5).

Drag-and-drop com `@dnd-kit` (`useDraggable` no card, `useDroppable` na coluna): arrastar para outra coluna muda o status. Estados visuais: card arrastado em opacidade reduzida, coluna-alvo destacada com zona "Solte aqui", `DragOverlay` com preview. Card rico (código, total, cliente, itens, tempo, chip de cancelamento, dot de não-lido). Paginação por coluna via "Ver mais N".

Soltar um pedido com solicitação de cancelamento abre o `CancellationRequestModal` em vez de mover.

---

## Drawer de detalhe (`OrderDetailDrawer` → `OrderDetailPanel`)

Overlay `fixed` 480px à direita, com scrim e slide-in. Faz `useOrderDetail(orderId)` (estados de carregando/erro próprios). Estrutura:

- **Header**: badge de status, `#código` + copiar, data completa · tempo relativo, nome do cliente.
- **Alerta de cancelamento** (se `cancellation_requested === 1`): motivo + "Aceitar e cancelar" / "Recusar".
- **Abas** (pílula): Resumo · Itens · Cliente · Histórico.
- **Footer**: "Iniciar preparação/Marcar como enviado/..." (avançar) + "Cancelar" (abre `CancelReasonModal`).

### Aba Resumo
Card de total (com composição de cupom quando houver) + observação do cliente.

### Aba Itens
Lista de itens (thumbnail ou placeholder, badge de quantidade, chips de tamanho/cor, notas) + card de totais (subtotal / desconto / total).

### Aba Cliente
Avatar + nome + `#código`; telefone (com/sem) e e-mail com copiar; ações WhatsApp (habilitada só com telefone) / Ligar / E-mail / Imprimir; endereço de entrega (com/sem — placeholder "retirada na loja").

### Aba Histórico
Caixa de cancelamento (se status 5, com motivo) + `OrderVendorTimeline` (linha do tempo dos status, com ramo de cancelamento).

---

## Modais e tempo real

- **CancelReasonModal**: textarea com contador `0/500`; "Confirmar cancelamento" desabilitado enquanto vazio.
- **CancellationRequestModal**: avatar/nome/código, motivo do cliente (ou "Nenhum motivo informado."), "Aceitar e cancelar" / "Recusar" (com loading).
- **FeatureLockedModal**: exportação travada (planos sem `feature_order_export`).
- **NewOrderToast**: alimentado por `useOrderNotifications` (socket `new_order` invalida `['orders']`); auto-dismiss. *Pendência: badge de não-lidos na sidebar não está ligado.*

---

## Responsividade

- **Desktop (`lg+`)**: header + KPIs + filtros + Lista/Quadro + drawer overlay.
- **Mobile (`< lg`)**: `MobileOrdersView` — KPIs compactos (Novos + Receita), segmentos com scroll, cards; detalhe em **bottom sheet** (reusa `OrderDetailPanel`).

---

## Exportação Excel

Apenas planos com `feature_order_export`. Botão "Exportar Excel" no header (estados: normal / exportando / travado com cadeado + "Plano Pro"). Travado → abre `FeatureLockedModal`; liberado → `GET /orders/export` com os filtros ativos.

---

## Dados e estados

- Query única: `useOrders({ page:1, limit:100, date_from, date_to })` carrega o conjunto recente (ou do período). Busca, status e ordenação são **client-side** sobre esse conjunto (mantém KPIs estáveis).
- Mudança de status com **optimistic update** em `['orders']`.
- Estados de página: carregando (skeleton) · vazio absoluto · vazio filtrado (limpar filtros) · erro (tentar novamente).

---

## Endpoints consumidos

| Ação | Endpoint |
|---|---|
| Listar pedidos | `GET /orders?page=&limit=&date_from=&date_to=` |
| Detalhe | `GET /orders/:id` |
| Atualizar status | `PATCH /orders/:id/status` (`{ status, cancellation_reason? }`) |
| Marcar como lido | `PATCH /orders/:id/read` |
| Aceitar cancelamento | `PATCH /orders/:id/cancel-request/accept` |
| Recusar cancelamento | `PATCH /orders/:id/cancel-request/deny` |
| Exportar Excel | `GET /orders/export` |
| Notificações | `GET /notifications` + socket `new_order` |

---

## Notas de implementação

- **Design system**: chrome usa tokens `nx*`; cores de status são exceção (paleta própria centralizada em `orderVendorMeta`). O `content` do `tailwind.config.ts` foi ampliado para `./src/**/*` para escanear as classes literais em `src/lib`.
- **lucide-react 0.294.0**: usar `XCircle` (não `CircleX`) e `Ticket` (não `TicketPercent`).
- **Não alterar** `OrderTrackingTimeline.tsx` (usado por `CustomerOrdersDrawer` no cliente).

---

## Pendências conhecidas

- Date-picker de range completo no filtro de período (hoje é toggle "últimos 7 dias").
- Badge de não-lidos no item "Pedidos" da `SidebarVendedor`.
- Endpoint `GET /orders/stats` para KPIs precisos (hoje calculados do conjunto carregado).
- `app/rastrear/_components/statusConfig.tsx` referencia a string `'CircleX'` (pré-existente, cliente) — ícone vazio na 0.294.
