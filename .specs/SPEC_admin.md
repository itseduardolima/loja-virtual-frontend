# SPEC — Painel Administrativo

> Spec de feature. Complementa `DESIGN_SPEC.md`. Acesso restrito ao perfil `Administrador` (profile_id = 1, code = 100).

---

## Visão geral

O painel admin é a área de gestão interna do marketplace: usuários, lojas, planos, assinaturas, estornos e cupons de plano. Layout paralelo ao do vendedor, com sidebar própria.

**Rota base:** `/admin`  
**Arquivo de layout:** `src/app/admin/layout.tsx`  
**Perfil requerido:** `Administrador` — código de permissão `110` em todos os endpoints.

---

## Layout

```
[SidebarAdmin — fixo à esquerda]
[Main content — flex-1, overflow-auto]
  [Page header]
  [Conteúdo]
```

### Sidebar admin

Mesmas regras de design do `SidebarVendedor` (ver `DESIGN_SPEC.md` seção 6):
- Background: `bg-nxsurf border-r border-nxborder`
- Item ativo: borda esquerda `nxp`, `bg-nxp/[0.09]`
- Item hover: `bg-nxi3/[0.08]`

Itens de navegação:

| Item | Rota | Ícone (lucide) |
|---|---|---|
| Dashboard | `/admin` | `LayoutDashboard` |
| Usuários | `/admin/usuarios` | `Users` |
| Lojas | `/admin/lojas` | `Store` |
| Assinaturas | `/admin/assinaturas` | `CreditCard` |
| Planos | `/admin/planos` | `Package` |
| Cupons de Plano | `/admin/cupons-plano` | `Tag` |
| Estornos | `/admin/estornos` | `RotateCcw` |

---

## Dashboard (`/admin`)

### KPI cards — 5 cards em `grid-cols-2 md:grid-cols-3 lg:grid-cols-5`

| Métrica | Token | Fonte |
|---|---|---|
| Total de usuários | `nxp` | `GET /admin/stats` |
| Vendedores ativos | `nxs` | |
| Lojas ativas | `nxs` | |
| Receita do mês | `nxa` | |
| Receita total | `nxp` | |

### Gráfico de receita

- Barras mensais (últimos 6 meses) via `Recharts`.
- Cores: `nxp` para receita total, `nxa` para receita do mês.
- Eixo Y: formatado em R$ com `Intl.NumberFormat`.
- Tooltip customizado com o mesmo estilo dos cards.

---

## Usuários (`/admin/usuarios`)

### Layout

```
[Header: "Usuários" + contagem total]
[Filtros: busca + perfil + status]
[Tabela]
[Paginação]
```

### Filtros

- Busca por nome ou e-mail (debounce 300ms)
- Perfil: Todos | Administrador | Vendedor | Cliente
- Status: Todos | Ativos | Inativos

### Tabela — colunas

| Coluna | Notas |
|---|---|
| Nome | `font-semibold` |
| E-mail | `text-nxi2` |
| Perfil | badge semântico |
| Status | toggle switch + badge |
| Criado em | `dd/MM/yyyy` |
| Ações | link "Ver detalhes" |

### Badge de perfil

| Perfil | Token |
|---|---|
| Administrador | `nxp` |
| Vendedor | `nxa` |
| Cliente | `nxi3` |

### Detalhe do usuário (`/admin/usuarios/[id]`)

- Dados completos do usuário (nome, e-mail, perfil, status, datas).
- Assinatura ativa (plano, status, datas, provedor).
- Loja associada (se vendedor): nome, slug, status.
- Histórico de pagamentos (tabela resumida).
- Ações: ativar/desativar usuário.

---

## Lojas (`/admin/lojas`)

### Tabela — colunas

| Coluna | Notas |
|---|---|
| Nome | `font-semibold` |
| Slug | `text-nxi3 font-mono` — link para vitrine `↗` |
| Dono | nome do usuário vinculado |
| E-mail | do usuário |
| Cidade / Estado | |
| Status | toggle switch + badge |
| Criado em | |

### Filtros

- Busca por nome ou slug
- Status: Todos | Ativas | Inativas

### Ações

- Toggle de status diretamente na tabela (sem abrir drawer).
- Nenhum CRUD de loja pelo admin — lojas são criadas pelos próprios vendedores.

---

## Assinaturas (`/admin/assinaturas`)

### Layout

```
[Header: "Assinaturas"]
[KPI: Ativas | Pendentes | Canceladas | Expiradas]
[Filtros: status + plano]
[Tabela]
```

### Tabela — colunas

| Coluna |
|---|
| Usuário (nome + e-mail) |
| Plano |
| Status (badge) |
| Início |
| Vencimento |
| Provedor de pagamento |

### Badge de status de assinatura

| Status | Token |
|---|---|
| `active` | `nxs` |
| `pending` | `nxw` |
| `canceled` | `nxd` |
| `expired` | `nxi3` |

---

## Planos (`/admin/planos`)

### Listagem

Tabela simples com os planos ativos:

| Coluna |
|---|
| Nome |
| Slug |
| Preço mensal |
| Preço anual |
| Máx. produtos |
| Features (badges) |
| Status |
| Ações: Editar |

### Criar / Editar plano

Formulário em `SectionCard`:

| Campo | Tipo |
|---|---|
| Nome | text, obrigatório |
| Slug | text, gerado automaticamente do nome |
| Descrição | textarea |
| Preço mensal | number (R$) |
| Preço anual | number (R$) |
| Máx. produtos | number (null = ilimitado) |
| Features | toggles: Perguntas, Dashboard avançado, Exportar pedidos, Cupons |
| Status | toggle |
| Ordem | number |

---

## Cupons de Plano (`/admin/cupons-plano`)

Cupons que dão desconto na assinatura de planos (diferente dos cupons de produto da loja).

### Listagem

| Coluna |
|---|
| Código |
| Desconto (% ou R$) |
| Plano(s) aplicável(is) |
| Limite de usos |
| Usos realizados |
| Validade |
| Status |
| Ações: Editar |

### Criar / Editar

| Campo | Tipo |
|---|---|
| Código | text, uppercase automático |
| Tipo de desconto | radio: Percentual / Valor fixo |
| Valor | number |
| Planos | multi-select (quais planos aceita) |
| Limite de usos | number (null = ilimitado) |
| Válido até | date picker |
| Status | toggle |

---

## Estornos (`/admin/estornos`)

Gestão de solicitações de estorno/chargeback via Asaas.

### Listagem

| Coluna |
|---|
| ID do estorno |
| Usuário / Vendedor |
| Valor |
| Status (badge) |
| Data da solicitação |
| Ações: Aprovar / Recusar |

### Badge de status

| Status | Token |
|---|---|
| Pendente | `nxw` |
| Aprovado | `nxs` |
| Recusado | `nxd` |

### Ações

- Botão "Aprovar": `NxButton variant="primary"` → `PATCH /admin/refunds/:id/approve`
- Botão "Recusar": `NxButton variant="danger"` → `PATCH /admin/refunds/:id/deny`
- Confirmar com `Dialog` antes de executar ação destrutiva.

---

## Endpoints consumidos

| Ação | Endpoint |
|---|---|
| Stats do dashboard | `GET /admin/stats` |
| Listar usuários | `GET /admin/users` |
| Detalhe do usuário | `GET /admin/users/:id` |
| Toggle status usuário | `PATCH /admin/users/:id/status` |
| Listar lojas | `GET /admin/stores` |
| Toggle status loja | `PATCH /admin/stores/:id/status` |
| Listar assinaturas | `GET /admin/subscriptions` |
| Listar planos | `GET /admin/plans` |
| Criar plano | `POST /admin/plans` |
| Editar plano | `PATCH /admin/plans/:id` |
| Listar cupons de plano | `GET /admin/plan-coupons` |
| Criar cupom | `POST /admin/plan-coupons` |
| Editar cupom | `PATCH /admin/plan-coupons/:id` |
| Listar estornos | `GET /admin/refunds` |
| Aprovar estorno | `PATCH /admin/refunds/:id/approve` |
| Recusar estorno | `PATCH /admin/refunds/:id/deny` |

Todos os endpoints requerem `PermissionGuard(110)` no backend.

---

## Permissões e acesso

- Guard global `JwtAuthGuard` + `PermissionGuard(110)` em todos os endpoints admin.
- Middleware de rota no Next.js: redireciona para `/login` se não autenticado, para `/vendedor/dashboard` se autenticado mas sem perfil admin.
- Não existe RBAC granular no admin — é binário: tem perfil `admin` ou não tem.

---

## Padrões de UX no admin

- **Confirmação para ações destrutivas**: qualquer ação de status (desativar usuário, recusar estorno) deve usar `Dialog` de confirmação antes do request.
- **Feedback inline**: após ação bem-sucedida, atualizar a linha na tabela sem reload (React Query `invalidateQueries`).
- **Sem deleção**: o admin não deleta entidades — apenas altera status. Preservar histórico.
- **Auditoria**: ações relevantes (aprovar/recusar estorno) devem ser confirmadas e os estados refletidos imediatamente na UI.
