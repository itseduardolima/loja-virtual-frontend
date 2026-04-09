# loja-virtual-frontend (Next.js)

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14 — App Router |
| UI | React 18 + TypeScript 5 |
| Estilo | Tailwind CSS 3 + shadcn/ui (Radix UI) |
| Estado servidor | TanStack React Query v5 |
| Estado local | React Context (Auth, Toast) |
| HTTP | Axios 1.6 com interceptors |
| Formulários | React Hook Form 7 + Yup |
| Animações | Framer Motion 12 |
| Editor rich text | TipTap 3 |
| Gráficos | Recharts 2 |
| WebSocket | Socket.IO Client 4 |
| Drag & Drop | @dnd-kit/core 6 |
| Ícones | Lucide React |
| Data | date-fns + react-day-picker |

Roda na **porta 3001**. Backend esperado na **porta 3000** (`NEXT_PUBLIC_API_URL`).

## Estrutura de Diretórios

```
src/
├── app/                    # Rotas (Next.js App Router)
│   ├── admin/              # Painel administrativo (protegido — perfil Admin)
│   ├── assinatura/         # Seleção de plano (cliente)
│   ├── cadastro/           # Registro de usuário
│   ├── login/              # Login
│   ├── loja/[slug]/        # Loja pública (catálogo, produto, checkout)
│   ├── rastrear/           # Rastreamento de pedido por código
│   ├── vendedor/           # Dashboard do vendedor (protegido — perfil Vendedor)
│   ├── globals.css
│   ├── layout.tsx          # Root layout — wrap de todos os providers
│   └── page.tsx            # Home
├── assets/                 # Assets estáticos
├── components/             # Componentes React
│   ├── ui/                 # shadcn/ui (Radix): Button, Card, Input, Dialog, Select...
│   ├── Admin/              # Componentes do painel admin
│   ├── Animation/          # Utilitários de animação
│   ├── Cart/               # Sidebar do carrinho
│   ├── Category/           # Seção de categorias, modais
│   ├── Checkout/           # Fluxo de checkout
│   ├── Dashboard/          # Cards de stats, gráficos (Recharts), tabela de pedidos
│   ├── Dialog/             # ConfirmDialog e outros modais
│   ├── Form/               # DynamicFields, ImageUpload, ImageUploadByColor, ProductSteps
│   ├── Layout/             # SidebarVendedor, SidebarAdmin, UserHeader, AppFooter, LoadingSpinner, ErrorState
│   ├── Order/              # OrderTrackingTimeline, componentes de pedido
│   ├── Product/            # ProductCard, ProductFilters, ProductPreview, ProductReviews, ProductVariations, WishlistButton
│   ├── Store/              # StorePagination, StoreSidebar
│   ├── Subscription/       # Componentes de assinatura
│   ├── Table/              # Tabelas de dados
│   ├── Toast/              # ToastContainer
│   ├── User/               # CompleteProfileGuard
│   └── index.ts            # Barrel export de todos os componentes
├── contexts/
│   ├── AuthContext.tsx      # user, login, logout, refreshToken, loginWithGoogle
│   └── ToastContext.tsx     # showToast (success/error/warning)
├── hooks/                  # ~60 hooks customizados (React Query)
├── lib/
│   ├── api.ts              # Exporta a instância do axios
│   ├── axios.ts            # Instância axios + interceptors (refresh em 401)
│   ├── utils.ts
│   ├── imageUtils.ts
│   └── sanitize.ts
├── providers/
│   ├── QueryProvider.tsx   # React Query client (staleTime 60s, retry 3x, sem retry em 401)
│   └── HotToastProvider.tsx
├── schemas/                # Schemas Yup por formulário
│   ├── productSchemas.ts
│   ├── checkoutSchemas.ts
│   ├── createStoreSchemas.ts
│   └── ...
├── styles/
│   └── toast.css
├── types/                  # Tipos TypeScript globais
│   ├── auth.ts, api.ts, cart.ts, product.ts, order.ts
│   ├── category.ts, customer.ts, admin.ts, subscription.ts
│   ├── review.ts, niche.ts
│   └── index.ts            # Re-exporta todos os tipos
└── middleware.ts           # Rotas públicas: /login, /cadastro, /rastrear, /
```

## Rotas (App Router)

### Públicas
| Rota | Descrição |
|------|-----------|
| `/` | Home/landing page |
| `/login` | Login (email/senha + Google OAuth) |
| `/cadastro` | Registro |
| `/rastrear` | Rastrear pedido por código |
| `/loja/[slug]` | Página da loja |
| `/loja/[slug]/produtos` | Listagem de produtos com filtros |
| `/loja/[slug]/produto/[id]` | Detalhe do produto, reviews, Q&A, variações |
| `/loja/[slug]/checkout` | Checkout |
| `/loja/[slug]/pedido-sucesso` | Confirmação de pedido |
| `/assinatura` | Seleção de plano |

### Vendedor (protegido — perfil `Vendedor`)
| Rota | Descrição |
|------|-----------|
| `/vendedor/dashboard` | Dashboard com stats |
| `/vendedor/criar-loja` | Criar loja |
| `/vendedor/produtos` | Listar produtos |
| `/vendedor/produtos/criar` | Criar produto |
| `/vendedor/produtos/editar/[id]` | Editar produto |
| `/vendedor/categorias` | Gerenciar categorias |
| `/vendedor/pedidos` | Ver pedidos |
| `/vendedor/perguntas` | Perguntas sobre produtos |
| `/vendedor/cupons` | Cupons |
| `/vendedor/plano` | Plano de assinatura |
| `/vendedor/configuracoes/*` | informacoes-basicas, endereco, contatos, documentos, entrega, horario, pagamento |

### Admin (protegido — perfil `Administrador`)
| Rota | Descrição |
|------|-----------|
| `/admin` | Dashboard admin |
| `/admin/usuarios` | Gerenciar usuários |
| `/admin/lojas` | Gerenciar lojas |
| `/admin/assinaturas` | Assinaturas |
| `/admin/estornos` | Estornos/chargebacks |
| `/admin/planos` | Planos (criar/editar) |

## Estado e Gerenciamento de Dados

### AuthContext (`src/contexts/AuthContext.tsx`)
- Persiste `user-data` no **localStorage**
- Fornece: `user`, `isAuthenticated`, `isLoading`, `login()`, `logout()`, `loginWithGoogle()`
- Integrado com interceptor do axios para refresh automático em 401

### React Query (`src/providers/QueryProvider.tsx`)
- `staleTime: 60s` por padrão
- Retry: 3x; **sem retry em erro 401**
- Mutations: sem retry automático
- Padrão de query keys: `['recurso', filtros/params]`

### localStorage
| Chave | Conteúdo |
|-------|----------|
| `user-data` | Objeto do usuário serializado |
| `cart-session-{storeId}` | ID da sessão do carrinho |
| `wishlist-{storeId}` | Itens da wishlist |
| `redirect-after-login` | URL de redirecionamento pós-OAuth |

## API e HTTP

**Instância axios:** `src/lib/axios.ts`
- `baseURL`: `process.env.NEXT_PUBLIC_API_URL` (default: `http://localhost:3000`)
- `timeout`: 10s
- `withCredentials: true` (cookies httpOnly enviados automaticamente)

**Interceptors:**
1. **Request:** Se FormData, remove `Content-Type` (deixa o browser definir boundary)
2. **Response:** Em 401 → chama `POST /auth/refresh_token` → retry da request original; se refresh falhar → logout + redirect `/login`; fila previne múltiplos refreshes simultâneos

**Importar a instância:** `import { api } from '@/lib/api'`

## Componentes UI (shadcn/ui)

Todos em `src/components/ui/`. Usar sempre esses ao invés de criar do zero:
`Button`, `Card`, `Input`, `Label`, `Select`, `Dialog`, `Table`, `Checkbox`, `Switch`, `Slider`, `Toast`, `Pagination`, `Calendar`, `DateTimePicker`, `Popover`, `Sheet`, `Badge`, `Textarea`, `Breadcrumbs`, `RichTextEditor` (TipTap), `Chart` (Recharts)

## Hooks

Localização: `src/hooks/`. Todos seguem o padrão:
```typescript
export function useRecurso(params?) {
  return useQuery({
    queryKey: ['recurso', params],
    queryFn: async () => api.get('/endpoint'),
    staleTime: 5 * 60 * 1000,
  })
}
```

Principais hooks disponíveis:
- `useLogin`, `useRegister`, `useAuth`
- `useProducts`, `useStoreProducts`, `useProduct`
- `useCart`, `useCheckout`
- `useOrders`, `useCustomerOrders`, `useOrderDetail`, `useTrackOrder`
- `useCategories`, `useCoupons`, `useDashboard`
- `useProductReviews`, `useProductQuestions`
- `useWishlist`, `useRecentlyViewed`
- `useAdmin*` (vários hooks admin)
- `useToast`

## Formulários

- **React Hook Form** para estado de formulário
- **Yup** para validação (schemas em `src/schemas/`)
- Resolver: `@hookform/resolvers/yup`
- Componente `DynamicFields` (`src/components/Form/DynamicFields.tsx`) — campos dinâmicos baseados no nicho do produto
- Produto usa wizard multi-step: `ProductSteps.tsx`

## Tipagem

Todos os tipos globais em `src/types/`. Importar via:
```typescript
import type { Product, Order, CartItem } from '@/types'
```

## Estilo

- **Tailwind CSS** — principal; não usar CSS modules
- **CSS variables HSL** para tema (`--primary`, `--background`, `--foreground`, etc.)
- **`cn()`** para merge de classes:
  ```typescript
  import { cn } from '@/lib/utils'
  className={cn('base-class', condicao && 'conditional-class')}
  ```
- **`clsx`** para condicionais simples
- Fontes: `font-sans` (Nunito), `font-integral` (Integral CF), `font-satoshi` (Satoshi)
- Styled Components instalado mas uso mínimo — preferir Tailwind

## Scripts

```bash
pnpm dev          # Dev na porta 3001
pnpm build        # Build de produção
pnpm start        # Produção na porta 3001
pnpm lint         # ESLint
```

## Variáveis de Ambiente

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

`NEXT_PUBLIC_*` fica disponível no browser. Sem essa variável a API não funciona.

## Padrões e Convenções

- **Nomenclatura:** componentes PascalCase, hooks `use`-prefix, utilitários camelCase
- **Barrel exports:** importar componentes de `@/components`, tipos de `@/types`
- **`'use client'`** obrigatório em componentes com hooks/interatividade
- **Proteção de rotas por perfil:** `CompleteProfileGuard` + redirecionamento por perfil no AuthContext
- **Imagens:** sempre `<Image>` do Next.js; URLs remotas configuradas em `next.config.js`
- **Sanitização HTML:** `dompurify` via `src/lib/sanitize.ts` antes de renderizar conteúdo do usuário
- **WebSocket:** `useOrderNotifications` — conecta socket.io para notificações em tempo real
- **Configuração shadcn:** `components.json` — rodar `npx shadcn@latest add <component>` para adicionar novos componentes
