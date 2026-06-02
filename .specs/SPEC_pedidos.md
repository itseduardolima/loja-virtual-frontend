# SPEC — Pedidos (Vendedor)

> Spec de feature. Complementa `DESIGN_SPEC.md`.

---

## Visão geral

O módulo de pedidos permite ao vendedor acompanhar, filtrar e gerenciar todos os pedidos da sua loja. Acesso em `/vendedor/pedidos`.

**Arquivos principais:**
- `src/app/vendedor/pedidos/page.tsx`
- `src/app/vendedor/pedidos/useOrdersPage.ts`

---

## Layout da página

```
[Header: "Pedidos" + filtros (busca, período) + botão "Exportar Excel" (plano Pro/Max)]
[Kanban: 5 colunas, uma por status — drag-and-drop (@dnd-kit/core)]
[Painel lateral de detalhe (lg+) — OrderDetailPanel]
```

Desktop: Kanban horizontal scrollável com 5 colunas. Mobile (`< lg`): `MobileOrdersView` (listagem vertical com swipe de ações).

> **Não há tabela de pedidos nem paginação clássica.** O layout é Kanban com colunas por status. Drag-and-drop entre colunas atualiza o status via `PATCH /orders/:id/status`.

---

## KPI cards

4–5 cards no padrão do design system (`rounded-2xl border border-nxborder`):

| Card | Token de cor |
|---|---|
| Total de pedidos | `nxp` |
| Pendentes | `nxw` |
| Confirmados / Entregues | `nxs` |
| Cancelados | `nxd` |
| Receita do mês | `nxs` com símbolo R$ |

---

## Kanban de pedidos

5 colunas fixas, definidas em `STATUS_ORDER = [1,2,3,4,5]` (`src/lib/orderPanelUtils.tsx`).

### Status e cores das colunas

> ⚠️ As colunas do Kanban usam **classes Tailwind diretas** (não tokens `nx*`) — é uma exceção documentada ao design system.

| Status | Label | Cor da coluna | Fluxo possível |
|---|---|---|---|
| 1 | Pendente | `yellow` | → 2 (Confirmar) ou 5 (Cancelar) |
| 2 | Confirmado | `blue` | → 3 (Enviar) ou 5 (Cancelar) |
| 3 | Enviado | `purple` | → 4 (Entregue) ou 5 (Cancelar) |
| 4 | Entregue | `green` | — (final) |
| 5 | Cancelado | `red` | — (final) |

Fluxo de status definido em `STATUS_FLOW` (só permite avançar para o próximo ou cancelar, não pular etapas).

### Ícone de não-lido

Pedidos com `read = 0` exibem ponto indicador no card. `PATCH /orders/:id/read` ao abrir o detalhe.

### Fluxo de cancelamento

Clientes podem solicitar cancelamento a partir da vitrine pública. O vendedor recebe no painel:
- `Notice variant="amber"` no painel de detalhe com o motivo do cancelamento
- Botão "Aceitar cancelamento" → `PATCH /orders/:id/cancel-request/accept`
- Botão "Recusar cancelamento" → `PATCH /orders/:id/cancel-request/deny` (exige motivo em textarea)

---

## Filtros

- **Busca**: por código, nome do cliente ou número do pedido (`debounce 300ms`)
- **Status**: Todos + cada status listado acima
- **Período**: date range picker (`react-day-picker`) — `date_from` + `date_to`

Filtros ativos exibem badges com botão de remoção individual (padrão da StoreSidebar).

---

## Drawer de detalhe do pedido

Ao clicar em uma linha, abrir um `Sheet` (drawer lateral direito) com:

### Cabeçalho do drawer
- Código do pedido (bold, mono)
- Badge de status
- Data de criação

### Seção: Cliente
- Nome, e-mail, telefone, CPF/CNPJ
- Endereço de entrega formatado

### Seção: Itens
Lista dos `ORDER_ITEM`:
- Imagem do produto (thumbnail 48×48)
- Nome + variantes (cor, tamanho)
- Quantidade × preço unitário
- Subtotal alinhado à direita

### Seção: Resumo financeiro
```
Subtotal:          R$ XXX,XX
Cupom (CODIGO):   -R$ XX,XX
Total:             R$ XXX,XX
```

### Seção: Status e histórico
- Select de status atual → botão "Atualizar status"
  - `PATCH /orders/:id/status` com `{status: N}`
- Timeline do `ORDER_STATUS_HISTORY`:
  - Cada mudança com data/hora e label do status
  - Estilo de linha vertical conectando os pontos

### Ações especiais
- **Solicitação de cancelamento pendente** (`cancellation_requested = 1`): exibir `Notice variant="amber"` com motivo e dois botões: "Aceitar cancelamento" (`nxd`) / "Recusar cancelamento" (`nxs`)
- **Link WhatsApp**: botão que abre `GET /orders/:id/whatsapp-link` — link pré-formatado para contato com o cliente

### Dados NF-e (se `nfe_status` presente)
- Status da NF-e com badge semântico
- Links para PDF e XML
- Número e série

---

## Exportação Excel

Disponível apenas nos planos Pro e Max (`feature_order_export`).

- Botão "Exportar" no header da página
- Chama `GET /orders/export` com os mesmos filtros ativos
- Download automático do arquivo `.xlsx`
- Se plano não suportar: botão desabilitado com tooltip "Disponível no Plano Pro"

---

## Estados especiais

### Estado vazio
```
Ícone ShoppingBag (lucide, 48px, nxi3)
"Nenhum pedido ainda"
"Quando seus clientes finalizarem compras, os pedidos aparecerão aqui."
```

### Carregamento
- Skeleton nas colunas do Kanban
- KPI cards com shimmer

---

## Notificações em tempo real

O vendedor recebe notificações via WebSocket quando um novo pedido chega:
- Toast no canto superior direito com `nxa`
- Badge de contagem na sidebar (item "Pedidos")
- A tabela faz refetch automático via `invalidateQueries(['orders'])`

Hook: `useOrderNotifications` em `src/hooks/`

---

## Endpoints consumidos

| Ação | Endpoint |
|---|---|
| Listar pedidos | `GET /orders?page=&limit=&status=&date_from=&date_to=&search=` |
| Detalhe | `GET /orders/:id` |
| Histórico de status | `GET /orders/:id/status-history` |
| Atualizar status | `PATCH /orders/:id/status` |
| Marcar como lido | `PATCH /orders/:id/read` |
| Link WhatsApp | `GET /orders/:id/whatsapp-link` |
| Aceitar cancelamento | `PATCH /orders/:id/cancel-request/accept` |
| Recusar cancelamento | `PATCH /orders/:id/cancel-request/deny` |
| Exportar Excel | `GET /orders/export` |
| Stats / KPIs | `GET /orders/stats` |
