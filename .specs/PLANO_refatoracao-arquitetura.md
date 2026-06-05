# Plano de Refatoração — Conformidade com SPEC_arquitetura-frontend.md

> Gerado a partir de auditoria multi-agente (11 dimensões, 468 arquivos) em 2026-06-05.
> Cada fase é um conjunto de PRs independentes. Ordem pensada para que fases anteriores destravem as seguintes.

## Diagnóstico resumido

| Dimensão | Conformidade | Problema central |
|---|---|---|
| Page/Hook (Seção 1) | 84% | 8 pages com lógica de negócio inline |
| Taxonomia de hooks (Seção 4) | 76% | Subscription fragmentado em 11 arquivos; hooks single-use em `src/hooks/` |
| Componentes (Seção 3) | 25% | 17/22 dirs sem barrel; 82+ imports diretos |
| Types/`any` (Seções 7–8) | 88% | 180 `any` em 58 arquivos; `(store as any)` 40+ vezes |
| React Query (Seção 9) | 92% | 3 hooks da loja fora do React Query; 3 mutations sem onError |
| Loading/Error (Seção 11) | 20% | Zero `loading.tsx`/`error.tsx`; 10 pages retornam `null` |
| RSC (Seção 2) | 5% loja / 70% painel | Loja 100% client; zero `generateMetadata` |
| Helpers (Seção 6) | 35% | 23 duplicações de formatação/status |
| Forms (Seção 10) | 55% | 4 config pages sem `isDirty`; lodash ausente |
| Navegação (Seção 12) | 60% | 24 `window.location`; reload() em retry |
| DESIGN_SPEC (vendedor) | 11% | 182 cores genéricas, 43 Button shadcn |

---

## Fase 0 — Fundamentos (destrava todo o resto) · ~1 dia ✅ CONCLUÍDA (2026-06-05)

Pré-requisitos consumidos pelas fases seguintes. Sem dependências entre si — paralelizável.

> **Status:** executada via workflow multi-agente; `tsc` e `pnpm build` verdes. 98 arquivos alterados (19 barrels novos, 62 com imports reescritos). Desvios em relação ao planejado:
> - `types/api.ts` já tinha `Meta` — `PaginationMeta` não foi criado (usar `Meta`).
> - `free_shipping_enabled` NÃO existe no backend — mantido em `UpdateStorePayload` com comentário porque `useEntrega` o envia; limpar na Fase 1 junto com os casts.
> - `lib/stringUtils.ts` desnecessário — `vendor.ts` já tinha `getInitials`/`avatarHueFor`/`timeAgo`; só `isValidEmail`/`daysUntil`/`isExpired`/`formatDateShort`/`formatDateLong` foram adicionados a `utils.ts`.
> - Status maps centralizados criados (`PAYMENT_STATUS`, `SUBSCRIPTION_STATUS`, `COUPON_STATUS` em vendor.ts), mas as páginas consumidoras ainda usam os locais — substituição é a Fase 1.3.
> - `orderPanelUtils.tsx` → `orderPanelUtils.ts` (puro) + `components/Order/OrderStatusIcon.tsx` (JSX), 3 call sites atualizados.

### 0.1 Instalar lodash
```bash
pnpm add lodash && pnpm add -D @types/lodash
```
Consumido pela Fase 5 (dirty-check com `isEqual`).

### 0.2 Completar tipos de domínio em `src/types/`
O padrão `(store as any)?.campo` aparece 40+ vezes porque `StoreInfo` está incompleto.
- [ ] `types/store.ts`: adicionar TODOS os campos usados via cast — `business_hours`, `payment_methods`, `free_delivery_min`, `pickup_enabled`, `whatsapp`, `instagram`, `facebook`, `email`, `cnpj`, `cpf`, `address/city/state/zipcode/neighborhood/number/complement`, `store_niches`, campos de vitrine (`hero_*`, `announcement_text`, `campaign_*`)
- [ ] `types/api.ts`: criar `PaginationMeta` (mata 5× `meta={meta as any}` no admin)
- [ ] Criar `UpdateStorePayload` em `types/store.ts`
- [ ] Mover tipos de domínio exportados de lugar errado → `src/types/`:
  - `NormalizedPlan` (`app/_landing/price.ts`) → `types/subscription.ts`
  - `NavLink`, `FaqItem`, `Step`, `FooterColumn` (`app/_landing/data.ts`) → `types/landing.ts`
  - `Column` (`components/Table/Table.tsx`) → manter no componente mas parametrizar `Column<TData>` (é tipo de infra, não domínio)
  - Demais 15 tipos listados na auditoria (Coupon, StoreQuestion, VitrineFormData…)

### 0.3 Consolidar helpers em `lib/`
- [ ] `lib/utils.ts`: garantir `formatBRL`, `formatPrice`, `formatDate` (+ variante com `timeZone: 'UTC'` e mês longo usada em assinatura)
- [ ] Criar `lib/dateUtils.ts` OU estender `utils.ts`: `daysUntil`, `isExpired`, `relativeTime`
- [ ] `lib/vendor.ts`: unificar status maps — hoje existem 4 paralelos (`ORDER_STATUS` em vendor.ts, `STATUS_CONFIG` em rastrear, `STATUS_MAP` em PaymentHistory, `statusMap` em useAssinaturasPage, `STATUS_CONFIG` em cupons-plano). Criar mapas centralizados: `ORDER_STATUS` (com ícones), `PAYMENT_STATUS`, `SUBSCRIPTION_STATUS`, `COUPON_STATUS`
- [ ] `lib/stringUtils.ts`: `initials`, `avatarColor`, `isValidEmail` (hoje inline em equipe/page.tsx e OrderDetailPanel)
- [ ] Renomear `lib/orderPanelUtils.tsx` → separar helpers puros (`.ts`) do `getStatusIcon` (JSX → `components/Order/`)

### 0.4 Barrel exports (mecânico)
- [ ] Criar `index.ts` nos 17 dirs sem barrel: Admin, Animation, Bling, Cart, Category, Checkout, Dashboard, Dialog, Form, Layout, Order, Product, ProductForm, Store, Store/Product, Subscription, Table, Toast, User
- [ ] Atualizar os 82+ imports diretos para usar barrels (find&replace assistido; prioridade: ProductForm 37, Store 31, Store/Product 15, Order 10)

---

## Fase 1 — Higiene mecânica (paralelizável, baixo risco) · ~2 dias ✅ CONCLUÍDA (2026-06-05)

> **Status:** executada via workflow (6 agentes regionais + verificador); `tsc` e `pnpm build` verdes; ~92 arquivos. Resultados e desvios:
> - **`any`: 180 → 59.** Os 59 restantes: casts `yupResolver(...)` (incompatibilidade estrutural Yup InferType × RHF generics — documentados), narrowing de catches e workarounds de libs.
> - **`window.location`: só exceções documentadas** (OAuth Google/Bling, interceptor axios, `history.replaceState` pós-callback, leitura de `origin` p/ share). Zero `reload()`/`router.refresh()` em retries — loja usa `refetch()` dos hooks (queryClient só após Fase 3).
> - `useCreateSubscription`/`useValidatePlanCoupon`: onError NÃO adicionado de propósito — call sites usam `mutateAsync`+try/catch com toast próprio (evita toast duplicado). `usePreviewChangePlan` ganhou onError (call site usa `mutate()`).
> - `useAdminPlans`: invalidate órfão `['coupons']` corrigido para `['admin', 'plan-coupons']`.
> - `free_shipping_enabled` removido de `UpdateStoreData` e do payload do useEntrega (derivado de `free_delivery_min`).
> - ⚠️ **Regressão evitada:** o verificador havia embrulhado o `AuthProvider` em `<Suspense>` (por `useSearchParams` no provider raiz) — isso esvaziava o HTML prerenderizado de TODAS as páginas (CSR-bailout global). Revertido manualmente para leituras de `window.location` em useEffect/handler (client-only, não afeta prerender) com comentários de exceção.
> - Sobras anotadas p/ Fase 2: `STATUS_CONFIG` do rastrear (ícones JSX inline, página será reescrita); `fmtDate` UTC do admin/cupons-plano; `Intl.NumberFormat` em 6 components (OrderPrintModal, RenewSubscriptionModal, ProductForm/data, BlingImportCard, ProductReviews).

### 1.1 Navegação (20 violações)
- [ ] `lib/axios.ts:62` — remover `window.location.href` no 401; propagar erro e deixar AuthContext/page decidir (avaliar: manter como fallback documentado se o refactor for arriscado)
- [ ] `contexts/AuthContext.tsx` — `useSearchParams()` em vez de `window.location.search`; OAuth redirect é exceção legítima (`window.location.href` para URL externa do Google é correto — documentar)
- [ ] `hooks/useBlingStatus.ts:40` — retornar `authUrl` da mutation; page decide navegação (OAuth externo = exceção ok)
- [ ] 6× retry com `reload()`/`router.refresh()` → `queryClient.invalidateQueries` (pedido-sucesso, loja home, loja produtos, pedidos, produtos, produto detalhe)
- [ ] `app/_landing/Navbar.tsx:27,31` — `<a href>` → `<Link>`
- [ ] `vendedor/layout.tsx:60`, `useOrdersPage.ts:99`, `StoreHeader.tsx:120`, `useUnsavedChanges.ts:67,89` — `usePathname()`/`useSearchParams()` em vez de `window.location.*`
- [ ] 4× `useParams()` sem assert de tipo → `as { id: string }`

### 1.2 React Query (8 violações)
- [ ] `useCreateSubscription`, `usePreviewChangePlan`, `useValidatePlanCoupon` — adicionar `onError` com padrão `error.response?.data?.message || fallback`
- [ ] `useCart.ts:127,166,191` — extrair mensagem do erro em vez de string fixa
- [ ] `useAdminPlans.ts:12` — corrigir `invalidateQueries(['coupons'])` órfão (key não existe em nenhum data hook)

### 1.3 Eliminar duplicações de formatação (23 casos)
Consome 0.3. Substituir por imports de `lib/`:
- [ ] Deletar `app/vendedor/plano/_utils.ts` (fmtBRL/fmtDate duplicados)
- [ ] 11 formatações de moeda inline (plano/_components 4×, entrega, useAdminPage, admin/planos, admin/estornos, _landing/price, CouponForm)
- [ ] 8 formatações de data inline (SubscriptionCard, perguntas, categorias, CompletedStep, OrderDetailPanel, OrderPrintModal, ChangePlanModal 2×)
- [ ] 4 status maps locais → mapas centralizados de `lib/vendor.ts`

### 1.4 Censo de `any` — top offenders (180 usos, 58 arquivos)
Consome 0.2. Atacar por lote:
- [ ] **Lote A — `(store as any)`** (40+ usos): useEntrega, useEndereco, useInformacoesBasicas, useContatos, useDocumentos, useNichos, useVendedorPage → `StoreInfo` tipado
- [ ] **Lote B — React Hook Form genéricos**: CouponForm (`UseFormRegister<any>` etc. → `CouponFormValues`), remover `yupResolver(...) as any` (5 arquivos)
- [ ] **Lote C — `onError: (err: any)`** (~10 usos) → `AxiosError`
- [ ] **Lote D — props de componentes**: ProductFilters (`FiltersState` tipado), Table (`Column<TData>` genérico), StepNiche/StepContact/StepBasicInfo, UserDetailDrawer
- [ ] **Lote E — `meta as any`** (5 pages admin) → `PaginationMeta` de 0.2
- [ ] **Lote F — page-hooks restantes**: useOrdersPage, useAssinaturaPage, useCreateStorePage, useEditProductPage (`user: any` → `User`), useCreateProductPage

---

## Fase 2 — Page/Hook separation (8 pages) · ~3 dias ✅ CONCLUÍDA (2026-06-05)

> **Status:** 5 agentes + verificador; `tsc`/`build` verdes; 14 pages conformes por grep (useState residual só de UI trivial documentado). Resultados:
> - Pages encolheram: rastrear 380→281 (só JSX), admin/cupons-plano 437→131 (+8 componentes em `_components/`), equipe 570→292 (+InviteModal extraído).
> - Novos page-hooks: useRastrearPage, useAdminPlanCouponsPage, useAdminUserDetailPage, useEquipePage, usePedidoSucessoPage, useLoginPage. Consolidados: useVendedorPage, useDashboardPage (+useStore), useStorePage (+useStoreInfo/Categories/Niches/Fields), useProductDetailPage (+useStoreInfo, useAddToCartAnimation inlined, +reviews/questions/wishlist via fix do verificador), useStoreHomePage (+jumpTo), useCheckoutPage (+focusedField).
> - **Equipe redesenhada** com DESIGN_SPEC (tokens nx*, NxButton/_shared, padrão de horario/pagamento); mock isolado no hook com TODO p/ backend.
> - Checkout: blocos de endereço NÃO extraídos (17 props acopladas, sem ganho — anotado); diff mínimo 9+/3−.
> - Pendências anotadas: STATUS_CONFIG do rastrear em `_components/statusConfig.tsx` com TODO de unificação; `fmtDateShortMonth` local no hook de cupons-plano (formato month:'short' difere de formatDateShort); useProductDetailPage tem useQuery inline com api.get (contido no hook — split em data hook é Fase 3).

Por ordem de severidade. **Nota:** nas pages que serão reescritas aqui, aplicar o DESIGN_SPEC junto (não tocar o mesmo arquivo duas vezes) — ver Fase D.

- [ ] **`rastrear/page.tsx`** (380L, alta) — criar `useRastrearPage.ts`: searchCode, cancelDialog, query params effect, cancel mutation. Mover `STATUS_CONFIG` para `lib/vendor.ts` (já em 0.3)
- [ ] **`admin/cupons-plano/page.tsx`** (437L, alta) — criar `useAdminPlanCouponsPage.ts`; extrair 8 sub-componentes inline para `components/Admin/Coupons/` com barrel; helpers → lib (0.3)
- [ ] **`vendedor/configuracoes/equipe/page.tsx`** (570L, alta/G) — criar `useEquipePage.ts`; extrair `InviteModal` para componente; helpers → `lib/stringUtils.ts` (0.3). ⚠️ Verificar: page usa `INITIAL_MEMBERS` mockado — confirmar se backend de equipe existe antes de refatorar
- [ ] **`loja/[slug]/checkout/page.tsx`** (790L, media) — mover `focusedField` para o hook; avaliar extração dos blocos de formulário de endereço para `components/Checkout/`
- [ ] **`login/page.tsx`** — extrair estado do form para `useLoginPage.ts`
- [ ] **`loja/[slug]/pedido-sucesso/page.tsx`** — criar `usePedidoSucessoPage.ts`
- [ ] **`vendedor/page.tsx`** — mover useMemo/useEffect para `useVendedorPage.ts` (já existe — consolidar)
- [ ] **`admin/usuarios/[id]/page.tsx`** — criar `useAdminUserDetailPage.ts`
- [ ] **Pages importando data hooks direto** (5 casos): produto/[id] (useStoreInfo, useAddToCartAnimation), pedido-sucesso, loja produtos (useStoreInfo, useStoreCategories, useNiches), vendedor/page (useStore), dashboard (useStore) → compor nos page-hooks
- [ ] `loja/[slug]/page.tsx` — mover `jumpTo` para o hook (baixa)

---

## Fase 3 — Reorganização de hooks · ~2 dias

- [ ] **Migrar para React Query** (pré-requisito dos retries da Fase 1.1 na loja): `useStoreInfo` (useQuery), `useStoreCategories` (useQuery), `useStoreProducts` (useInfiniteQuery com cursor — G, cuidado com paginação)
- [ ] **Consolidar subscription** (11 arquivos → por recurso): `useSubscription.ts` (query my-subscription + mutations cancel/renew/refund/changePlan/cancelScheduledChange/create/preview) + `useSubscriptionPlans.ts` (plans + plan). Padronizar queryKeys com prefixo `['subscription', ...]`
- [ ] **Mover hooks single-use**: `useOnboardingChecklist` → `app/vendedor/`, `useAddToCartAnimation` → inline no produto detalhe, `useFeatureLockedModal` → inline (2 usos — avaliar), `useHeaderSearch` → junto do componente HeaderSearch
- [ ] `useCreateProductPage` — compor `useCategories()` em vez de useQuery inline com api.get
- [ ] `useLogin` — extrair check de loja (`api.get('/stores/my-store')` inline) para compor `useStore`/hook próprio
- [ ] `useCart` split (G) — **adiar**: funciona, risco alto, baixo ganho imediato. Documentar como dívida conhecida

---

## Fase 4 — Loading & Error states · ~2 dias

- [ ] **`error.tsx`** nas 14 rotas com fetch (template único com `ErrorState` + reset): loja/[slug], loja produtos, loja produto/[id], pedido-sucesso, vendedor (pedidos, produtos, produtos/criar, produtos/editar/[id], cupons, categorias, dashboard), admin (usuarios, planos, assinaturas)
- [ ] **`loading.tsx`** nas mesmas rotas — skeletons simples (não precisa ser pixel-perfect; reusar LoadingPage onde não houver skeleton)
- [ ] **10 pages com `return null`** durante auth/loading → `<LoadingPage />` (pedidos:184, cupons editar/criar:27, categorias editar/criar, produtos:66 + 4 demais)
- [ ] **`notFound()`** nas rotas de detalhe quando API retorna 404 (produto/[id], produtos/editar/[id], admin/usuarios/[id]) — distinguir de erro de rede
- [ ] **`fullScreen={false}`** em ErrorState para erros de query parcial (hoje 0 usos — sempre full screen)
- [ ] `admin/usuarios/[id]` — substituir texto plano "Carregando…"/"não encontrado" por LoadingPage/notFound
- [ ] `vendedor/dashboard` — adicionar guard `LoadingPage` para authLoading/storeLoading antes do conteúdo

---

## Fase 5 — Forms & dirty-check · ~1 dia ✅ CONCLUÍDA (2026-06-05)

> **Status:** `tsc` e `pnpm build` verdes; diff revisado adversarialmente. Resultados e desvios:
> - **isDirty + handleReset + Descartar** adicionados aos 4 hooks/pages (`informacoes-basicas`, `contatos`, `endereco`, `documentos`) — agora os 9 config hooks têm dirty-check. Detalhes por página: informacoes-basicas considera logoFile/bannerFile no isDirty e o reset restaura previews + fecha crop dialog; contatos inclui `selectedCountry` no dirty (trocar DDI altera o whatsapp salvo); endereco ganhou generation counter (`cepFetchGen`) p/ busca ViaCEP em voo não sobrescrever o form após Descartar; documentos normaliza CNPJ/CPF com a máscara no load (formatCNPJ/CPF são idempotentes) p/ evitar falso-dirty.
> - **`JSON.stringify` → `isEqual`** (lodash/isEqual, subpath import): useEntrega, useHorario, useVitrine, usePagamento (sets ordenados). useNichos já comparava por sort manual sem JSON.stringify — mantido. Sobras de `JSON.stringify` em app/ NÃO são dirty-check de config: produtos/editar (snapshot string p/ unsaved-changes com Files) e checkout (payload JSON p/ API).
> - **showErrors: já resolvido** — cupons/categorias criar+editar usam RHF com `mode` default (`onSubmit`): erros só aparecem após o 1º submit, conforme a spec ("não mostrar erros antes do usuário tocar o campo"). Nada a fazer.
> - **RHF vs useState:** `SPEC_formularios.md` §10 veda RHF apenas em *formulários de configuração* (todos já em useState+Yup). Cupons/categorias são create/edit de recurso — RHF mantido, alinhado à spec e à stack declarada (RHF 7 + Yup).

- [x] **isDirty + handleReset + botão Descartar** nos 4 config pages sem: `informacoes-basicas`, `contatos`, `endereco`, `documentos` (padrão já implantado em vitrine/horario/nichos/pagamento)
- [x] **`JSON.stringify` → `isEqual`** nos 5 hooks: useEntrega, useHorario, useVitrine (+ revisar useNichos/usePagamento — arrays de primitivos `.sort()` podem ficar, documentar)
- [x] **showErrors flag** nos forms RHF que mostram erro on-change desde o início (cupons criar, categorias criar) — já estava conforme (RHF mode onSubmit)
- [x] Conferir `SPEC_formularios.md` sobre RHF vs useState em create/edit — alinhar cupons/categorias com o que a spec definir — spec só veda RHF em config; create/edit mantém RHF

---

## Fase 6 — RSC & SEO (projeto separado) · ~2 semanas

**Não entra no refactor principal.** Maior risco, maior esforço, arquitetura de providers precisa mudar. Recomendação: projeto próprio depois das fases 0–5, MAS antecipar o item de SEO:

- [ ] **Antecipável (alto valor, baixo risco): `generateMetadata`** — requer page RSC wrapper; alternativa mínima: criar `layout.tsx` RSC por rota da loja com `generateMetadata` async buscando `/catalog/store/:slug` (título, description, og:image) sem converter as pages
- [ ] **Antecipável: remover `'use client'` desnecessário** de 8 componentes sem hooks/handlers: StoreFeatureBanner, StoreMarquee, StoreHomeHero, AnnouncementBar, ProductPricing, ProductStockLine, Stars, EmptyImageState (callbacks viram client wrappers ou props de Link)
- [ ] Projeto RSC completo: reestruturar providers (QueryProvider/AuthProvider só em /vendedor e /admin), converter /loja/[slug]/* para RSC + Suspense + fetch server-side, /rastrear e checkout permanecem client
- [ ] `loja/[slug]/layout.tsx` — extrair `localStorage` effect para client component, layout vira RSC

---

## Fase D — DESIGN_SPEC (decisão: híbrido)

**Recomendação fundamentada** (auditoria: 11% conformidade no vendedor, 182 cores genéricas, 43 Button shadcn, 5–7 dias):

1. **Incluir JUNTO nas pages reescritas pela Fase 2**: `pedidos` (38 cores + 5 Buttons + Kanban), `cupons-plano`, `equipe`, `rastrear` — o JSX já vai ser reescrito; tocar duas vezes é desperdício.
2. **Fase própria DEPOIS (não misturar nos mesmos PRs do refactor estrutural)** para o resto: criar-loja (6 step-components), plano/_components (6 arquivos), categorias criar/editar, cupons/_components, perguntas. PRs de design puro são fáceis de revisar visualmente; misturados a refactor estrutural, escondem regressões.
3. **Fora de escopo do design spec**: admin e loja pública (têm design próprio — confirmar se haverá spec deles).

---

## Ordem de execução e dependências

```
Fase 0 (fundamentos) ──┬─→ Fase 1 (higiene; 1.3 e 1.4 dependem de 0.2/0.3)
                       ├─→ Fase 2 (pages; usa libs/tipos de 0.x) ──→ Fase D.1 (design junto)
                       ├─→ Fase 3 (hooks; 3.1 destrava retries de 1.1 na loja)
                       ├─→ Fase 4 (loading/error; independente)
                       └─→ Fase 5 (forms; depende de 0.1)
Fases 1–5 concluídas ──→ Fase D.2 (design restante) ──→ Fase 6 (RSC, projeto próprio)
```

**Esforço total estimado (sem Fase 6): ~11 dias úteis.** Com Fase D completa: ~16 dias. Fase 6: +2 semanas.

## Verificação por fase

- `pnpm build` + `pnpm lint` verdes a cada PR
- Fase 0.4: `grep -r "from '@/components/[A-Z][a-zA-Z]*/" src --include="*.tsx" --include="*.ts"` → só barrels
- Fase 1.4: contagem de `: any|as any` por diretório — meta: zero em hooks/ e types/, <20 no resto
- Fase 2: pages alvo sem `useState|useMemo|useCallback|api\.` (grep)
- Fase 4: toda rota com fetch tem `error.tsx` + `loading.tsx` (find)
- Fase 5: zero `JSON.stringify` em dirty-checks de objetos (grep em app/)
- Fase D: `grep -c 'gray-[0-9]|text-sm|text-lg'` no escopo vendedor → 0

## Riscos conhecidos

| Risco | Mitigação |
|---|---|
| Migração `useStoreProducts` → useInfiniteQuery quebra paginação da loja | Testar scroll infinito manualmente; manter fallback em branch |
| Mudança no axios.ts (401 redirect) afeta TODOS os fluxos auth | Fazer por último na Fase 1, testar logout/refresh/expiração |
| Barrel exports podem criar ciclos de import | Criar barrels sem re-exportar entre features; build detecta ciclos |
| `equipe/page.tsx` usa dados mockados (INITIAL_MEMBERS) | Confirmar status do backend antes; se não existe, refatorar só a estrutura |
| Consolidação de subscription muda queryKeys → caches órfãos | Invalidar tudo no deploy; revisar todos os invalidateQueries |
