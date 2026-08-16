# Nexo — Frontend (vitrine + painéis)

Interface do **Nexo**, um SaaS multi-tenant onde lojistas assinam um plano, montam a própria vitrine
(`/loja/<slug>`) e vendem para o consumidor final. A plataforma cobra a assinatura do lojista, não a
venda.

Este repositório é o **frontend**: um único aplicativo Next.js 14 (App Router) que entrega três
experiências distintas na mesma base de código:

1. **Vitrine pública** (`/loja/[slug]/...`) — catálogo, página de produto, carrinho e checkout de
   convidado (sem login), rastreamento de pedido e páginas institucionais da loja.
2. **Painel do lojista** (`/vendedor/...`) — produtos, categorias, pedidos, cupons, perguntas,
   personalização da vitrine, configurações da loja e plano/assinatura.
3. **Painel administrativo** (`/admin/...`) — usuários, lojas, planos, cupons de plano, assinaturas
   e estornos da plataforma.

Todas as regras de negócio ficam na API — o repositório
[`loja-virtual`](../loja-virtual) (NestJS + Prisma + SQL Server). Este projeto não tem banco nem
rotas de API próprias: tudo passa pelo `NEXT_PUBLIC_API_URL`.

---

## Estado do projeto

Pré-lançamento. O levantamento de pendências e riscos conhecidos — dos dois repositórios — está em
[`../GAPS.md`](../GAPS.md). Vale a leitura antes de mexer em checkout, rastreamento/cancelamento de
pedido ou nas telas de assinatura.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) + React 18 + TypeScript 5 |
| Estilo | Tailwind CSS 3 + shadcn/ui sobre Radix UI |
| Estado de servidor | TanStack React Query 5 |
| Estado global | React Context (`AuthContext`, `ToastContext`) |
| HTTP | Axios 1.6 com interceptors (refresh automático em 401) |
| Formulários | React Hook Form 7 + Yup 1 (`@hookform/resolvers`) |
| Gráficos | Recharts 2 |
| Editor rich text | TipTap 3 |
| Tempo real | `socket.io-client` 4 (notificação de novo pedido) |
| Animação | Framer Motion 12 |
| Drag & drop | `@dnd-kit` 6 |
| Datas | `date-fns` 4 + `react-day-picker` 9 |
| Sanitização | DOMPurify 3 (`src/lib/sanitize.ts`) |
| Ícones | `lucide-react` |
| Testes | Playwright 1.59 (end-to-end) |
| Design system | Storybook 8 |

Fontes: Satoshi e Integral CF (locais, em `public/fonts/`), Nunito e IBM Plex Mono (Google Fonts via
`next/font`).

---

## Pré-requisitos

- **Node.js 18.17+** (exigência do Next 14).
- **pnpm** — o repositório versiona `pnpm-lock.yaml` (`npm`/`yarn` funcionam, mas ignoram o lockfile).
- **A API do Nexo rodando** ([`../loja-virtual`](../loja-virtual), por padrão em
  `http://localhost:3000`). Sem ela o front sobe, mas nenhuma tela carrega dados.

---

## Setup

```bash
# 1. Dependências
pnpm install

# 2. Variáveis de ambiente
cp .env.example .env.local
# preencha — veja a tabela da próxima seção

# 3. Subir em desenvolvimento (porta 3001)
pnpm dev
```

Abra `http://localhost:3001`.

A porta **3001** é fixa nos scripts `dev` e `start` porque a API ocupa a 3000 e o CORS do backend
libera exatamente a origem configurada no `APP_URL` dele — mudar a porta aqui exige mudar o
`APP_URL` lá.

---

## Variáveis de ambiente

Todas estão no `.env.example`. As `NEXT_PUBLIC_*` são inlined no bundle em tempo de build — ou seja,
**ficam visíveis no navegador**; nunca coloque segredo em nenhuma delas.

| Variável | Para que serve |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL base da API. É o `baseURL` do Axios (`src/lib/axios.ts`), a origem do WebSocket de notificações (`src/hooks/useOrderNotifications.ts`) e entra em `images.remotePatterns` no `next.config.js`. **Obrigatória** — sem ela toda requisição falha. |
| `NEXT_PUBLIC_APP_URL` | URL pública deste app. Usada para montar os links que o lojista copia e compartilha: endereço da vitrine (`/loja/<slug>`), pré-visualização do slug ao criar a loja e link de compartilhamento do produto. |
| `NEXT_PUBLIC_R2_HOSTNAME` | Hostname do bucket Cloudflare R2 onde ficam as imagens (ex.: `pub-xxxx.r2.dev`). Adicionado a `images.remotePatterns` para o `<Image>` do Next aceitar as URLs do CDN. |
| `NEXT_PUBLIC_FEATURE_EQUIPE` | Feature flag da tela Configurações → Equipe. Padrão desligada (só liga com `true` ou `1`). O motivo e o caminho para religar estão documentados em `src/lib/featureFlags.ts`. |

Só para os testes end-to-end (não são `NEXT_PUBLIC_`, não vão para o bundle):

| Variável | Para que serve |
|---|---|
| `TEST_VENDOR_EMAIL` | E-mail de um usuário com perfil Vendedor real, usado pelo login do setup do Playwright. Padrão: `vendedor@teste.com`. |
| `TEST_VENDOR_PASSWORD` | Senha desse usuário. Padrão: `senha123`. |

---

## Scripts

| Comando | O que faz |
|---|---|
| `pnpm dev` | Servidor de desenvolvimento na porta 3001. |
| `pnpm build` | Build de produção (`next build`). |
| `pnpm start` | Serve o build na porta 3001. |
| `pnpm lint` | ESLint via `next lint`. |
| `pnpm format` | Prettier em todo o projeto. |
| `pnpm format:check` | Prettier em modo verificação (não escreve). |
| `pnpm test:e2e` | Testes end-to-end com Playwright. |
| `pnpm test:e2e:ui` | Playwright em modo interativo (UI mode). |
| `pnpm test:e2e:report` | Abre o relatório HTML da última execução. |
| `pnpm storybook` | Storybook em `http://localhost:6006`. |
| `pnpm build-storybook` | Build estático do Storybook. |

---

## Testes

A cobertura automatizada deste repositório é **end-to-end, com Playwright**, em `e2e/`:
`auth`, `cart`, `catalog`, `dashboard`, `home` e `tracking`. Não há suíte de testes unitários no
front — a lógica testada unitariamente vive no backend.

```bash
pnpm test:e2e                    # suíte completa (Chromium desktop + Pixel 5)
pnpm test:e2e cart               # só os arquivos cujo caminho casa com "cart"
pnpm test:e2e --project=chromium # só o projeto desktop
```

Como funciona (`playwright.config.ts`):

- O `webServer` sobe o `pnpm dev` sozinho e reaproveita um servidor já rodando fora do CI.
- O projeto `setup` (`e2e/global.setup.ts`) faz login como Vendedor e salva a sessão em
  `e2e/.auth/vendor.json`; os demais projetos partem desse estado autenticado.
- **A API precisa estar no ar** e o usuário de `TEST_VENDOR_EMAIL` precisa existir com perfil
  Vendedor — o setup falha com mensagem explícita se as credenciais forem rejeitadas.

O Storybook (`pnpm storybook`) cobre o outro lado: os primitivos visuais do design system
(`src/stories/` — Button, Card, Input, Badge, Notice, KpiCard, ProductCard, tipografia e cores).

---

## Estrutura

```
src/
├── app/                      Rotas (App Router)
│   ├── _landing/             Seções da home pública (Hero, Pricing, FAQ, Footer...)
│   ├── _legal/               Componentes das páginas legais
│   ├── admin/                Painel administrativo
│   ├── assinatura/           Escolha de plano e pagamento (Asaas)
│   ├── auth/callback/        Retorno do OAuth do Google
│   ├── cadastro/ login/      Registro e login
│   ├── esqueci-senha/        Solicitação de recuperação de senha
│   ├── reset-password/       Definição de nova senha
│   ├── loja/[slug]/          Vitrine pública da loja
│   ├── rastrear/             Rastreamento de pedido por código
│   ├── vendedor/             Painel do lojista
│   ├── layout.tsx            Root layout — fontes e providers globais
│   ├── page.tsx              Landing pública
│   └── not-found.tsx         404
├── components/
│   ├── ui/                   shadcn/ui (Radix): button, card, input, dialog, table, select,
│   │                         calendar, chart, rich-text-editor, sheet, toast...
│   ├── Admin/ Vendor/ VendorList/     Painéis
│   ├── Cart/ Checkout/ Order/         Fluxo de compra
│   ├── Product/ ProductForm/ ProductList/  Catálogo e wizard de produto
│   ├── Store/ Landing/ Category/      Vitrine e home
│   ├── Dashboard/ Table/ Dialog/ Form/ Layout/ Toast/ Auth/ Subscription/ User/
│   └── index.ts              Barrel export
├── contexts/                 AuthContext (sessão, login/logout, Google) e ToastContext
├── hooks/                    ~66 hooks de dados (React Query) e de UI
├── lib/                      axios/api, featureFlags, sanitize, utils de imagem, vitrine,
│                             pedidos, planos e vendedor
├── providers/                QueryProvider (React Query) e HotToastProvider
├── schemas/                  Validação Yup por formulário
├── stories/                  Storybook do design system
├── styles/                   CSS complementar (toast)
├── types/                    Tipos compartilhados (product, order, cart, store, admin...)
└── middleware.ts             Middleware do App Router

e2e/                          Testes Playwright + setup de sessão
.specs/                       Specs de design e de features (ver abaixo)
.storybook/                   Configuração do Storybook
public/                       Imagens e fontes locais
```

### Rotas

**Públicas**

| Rota | O que é |
|---|---|
| `/` | Landing do Nexo (produto, planos, FAQ). |
| `/login`, `/cadastro` | Autenticação por e-mail/senha e Google OAuth. |
| `/esqueci-senha`, `/reset-password` | Recuperação de senha. |
| `/assinatura` | Escolha de plano e pagamento da assinatura do lojista. |
| `/loja/[slug]` | Home da vitrine da loja. |
| `/loja/[slug]/produtos` | Listagem com busca e filtros. |
| `/loja/[slug]/produto/[id]` | Detalhe do produto: variações, avaliações e perguntas. |
| `/loja/[slug]/checkout` | Checkout de convidado (não exige login). |
| `/loja/[slug]/pedido-sucesso` | Confirmação do pedido e contato com a loja. |
| `/loja/[slug]/pagina/[type]` | Páginas institucionais da loja (`trocas`, `envio`, `faq`, `sobre`, `politica`). |
| `/rastrear` | Rastreio de pedido pelo código. |

**Lojista** — `/vendedor/*`, exige sessão com perfil Vendedor e assinatura válida (checado em
`src/app/vendedor/layout.tsx`)

| Rota | O que é |
|---|---|
| `/vendedor` | Início: saudação, KPIs e checklist de onboarding. |
| `/vendedor/dashboard` | Dashboard com estatísticas e gráficos. |
| `/vendedor/criar-loja` | Criação da loja (wizard). |
| `/vendedor/produtos` (+ `criar`, `editar/[id]`) | CRUD de produtos. |
| `/vendedor/categorias` (+ `criar`, `editar/[id]`) | Categorias da loja. |
| `/vendedor/pedidos` | Pedidos, detalhe, mudança de status, WhatsApp e exportação. |
| `/vendedor/perguntas` | Perguntas dos clientes nos produtos. |
| `/vendedor/cupons` (+ `criar`, `editar/[id]`) | Cupons de desconto da loja. |
| `/vendedor/vitrine` | Identidade visual da vitrine (cor de marca, textos, campanha). |
| `/vendedor/plano` | Plano atual, troca de plano e cobrança. |
| `/vendedor/configuracoes/*` | `informacoes-basicas`, `contatos`, `endereco`, `documentos`, `entrega`, `horario`, `pagamento`, `nichos`, `ajuda` (páginas institucionais). |

**Administrador** — `/admin/*`, exige perfil Administrador (checado em `src/app/admin/layout.tsx`)

| Rota | O que é |
|---|---|
| `/admin` | Visão geral da plataforma. |
| `/admin/usuarios` (+ `[id]`) | Usuários. |
| `/admin/lojas` | Lojas cadastradas. |
| `/admin/planos` (+ `criar`, `editar/[id]`) | Planos de assinatura. |
| `/admin/cupons-plano` (+ `criar`, `editar/[id]`) | Cupons aplicáveis a planos. |
| `/admin/assinaturas` | Assinaturas dos lojistas. |
| `/admin/estornos` | Pedidos de estorno. |

---

## Como o app conversa com a API

- **Instância única de Axios** em `src/lib/axios.ts`, reexportada por `src/lib/api.ts`
  (`import { api } from '@/lib/api'`). `withCredentials: true`, timeout de 10s.
- **Sessão em cookie httpOnly** emitido pelo backend. O interceptor de resposta trata `401`
  chamando `POST /auth/refresh_token` e repetindo a requisição original; se o refresh falhar, faz
  logout e manda para `/login`. Uma fila evita refreshes simultâneos.
- **Proteção de rota é client-side**, nos layouts de `/vendedor` e `/admin`: eles validam o token
  contra a API (`useValidateToken`) e conferem o perfil antes de renderizar. O `src/middleware.ts`
  hoje não bloqueia nada — não conte com ele como barreira de acesso.
- **Cache de dados** com React Query (`src/providers/QueryProvider.tsx`): `staleTime` de 60s, até 3
  tentativas por query (sem retry em `401` e `404`, que retry não resolve) e mutations sem retry.

---

## Convenções

As regras de design e de arquitetura deste front estão em [`.specs/`](./.specs/) e valem para
qualquer tela nova:

| Documento | Conteúdo |
|---|---|
| [`.specs/DESIGN_SPEC.md`](./.specs/DESIGN_SPEC.md) | **Leia primeiro.** Cores, tipografia, espaçamento, componentes e padrões de página. |
| [`.specs/SPEC_arquitetura-frontend.md`](./.specs/SPEC_arquitetura-frontend.md) | **Leia segundo.** Divisão page/hook, componentes por feature, React Query, onde ficam tipos e helpers. |
| [`.specs/SPEC_formularios.md`](./.specs/SPEC_formularios.md) | Primitivos de formulário, validação Yup, upload com crop, wizard multi-step. |
| [`.specs/SPEC_loja-publica.md`](./.specs/SPEC_loja-publica.md) | Vitrine: home, listagem, produto, carrinho, checkout, rastreio. |
| [`.specs/SPEC_produto-crud.md`](./.specs/SPEC_produto-crud.md) | Wizard de produto, campos dinâmicos, variantes, imagens por cor. |
| [`.specs/SPEC_pedidos.md`](./.specs/SPEC_pedidos.md) | Pedidos: listagem, detalhe, status, WhatsApp, exportação, tempo real. |
| [`.specs/SPEC_niches-campos.md`](./.specs/SPEC_niches-campos.md) | Nichos e campos dinâmicos. |
| [`.specs/SPEC_admin.md`](./.specs/SPEC_admin.md) | Painel administrativo. |
| [`.specs/SPEC_assinatura-onboarding.md`](./.specs/SPEC_assinatura-onboarding.md) | Landing → plano → pagamento → criação da loja → primeiro produto. |

No dia a dia:

- Textos e mensagens de erro **em PT-BR**, sempre.
- Componentes em PascalCase, hooks com prefixo `use`, importação por barrel (`@/components`,
  `@/types`).
- `'use client'` em todo componente com hook ou interatividade.
- Estilo em Tailwind com o helper `cn()` (`src/lib/utils.ts`); nada de CSS Modules.
- `<Image>` do Next para imagens — hosts remotos precisam estar em `next.config.js`.
- Conteúdo HTML criado por lojista passa por `sanitizeHtml()` (`src/lib/sanitize.ts`) antes de ser
  renderizado.
- Componentes novos do shadcn/ui: `npx shadcn@latest add <componente>` (config em
  `components.json`).

`CLAUDE.md` na raiz complementa com o mapa detalhado de hooks, chaves de `localStorage` e padrões de
código.
