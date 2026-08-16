# SPEC — Assinatura & Onboarding do Vendedor

> Fluxo completo: landing page → escolha de plano → pagamento → criação da loja → primeiro produto.
> Esta spec cobre frontend e backend. Leia [`DESIGN_SPEC.md`](./DESIGN_SPEC.md) antes de tocar em qualquer tela.

---

## 1. Visão geral do fluxo

```
Landing (/)
  └─ CTA "Começar grátis" / "Assinar Plano X"
       └─ /assinatura?plan={slug}        ← página de checkout
            └─ POST /subscriptions       ← backend cria sub + Asaas
                 └─ /vendedor/criar-loja ← wizard 3 passos
                      └─ POST /stores    ← backend cria loja
                           └─ /vendedor  ← dashboard + checklist
                                └─ /vendedor/produtos/criar ← 4 passos
```

---

## 2. Landing Page (`/`)

**Arquivo:** `src/app/page.tsx` + `src/app/_landing/`

### Seções (em ordem)
| Componente | Arquivo | Papel |
|---|---|---|
| Navbar | `Navbar.tsx` | Navegação fixa, CTA "Começar grátis" → `/assinatura` |
| Hero | `Hero.tsx` | Headline principal, 2 CTAs, mockup dashboard + phone |
| BentoFeatures | `BentoFeatures.tsx` | 8 features em grid bento animado |
| HowItWorks | `HowItWorks.tsx` | 3 passos: conta → loja → vender |
| PricingSection | `PricingSection.tsx` | Cards de plano dinâmicos com toggle mensal/anual |
| FAQ | `FAQ.tsx` | Accordion com 8 perguntas + card WhatsApp |
| FinalCTA | `FinalCTA.tsx` | Banda escura, headline de urgência |
| Footer | `Footer.tsx` | Links, redes, copyright |

### Pontos de entrada para /assinatura
- Navbar → "Começar grátis" → `/assinatura`
- Hero → "Começar grátis" (primary CTA) → `/assinatura`
- PricingSection → "Assinar {Plano}" → `/assinatura?plan={slug}`
- FinalCTA → "Criar minha loja agora" → `/assinatura`

### PricingSection — comportamento

- Dados: `GET /subscriptions/plans` via hook `useSubscriptionPlans()`
- Toggle mensal / anual (com badge de desconto calculado em `price.ts > calcYearlyDiscount()`)
- Plano do meio marcado como `featured` (badge "Mais popular")
- Features por plano construídas via `buildPlanFeatures()` a partir dos campos do PLAN
- Trial: "14 dias grátis" exibido se `plan.trial_days > 0`
- CTA de cada card: `?plan={slug}` → pré-seleciona plano na página de checkout

### Regras de design da landing
- Paleta própria (indigo/verde/cyan) — NÃO usa tokens `nx*` (é área pública, não painel)
- Animações Framer Motion: stagger reveal, hover lift, parallax na FinalCTA
- Responsivo: mobile-first, breakpoints `md` e `lg`

---

## 3. Página de Checkout / Assinatura (`/assinatura`)

**Arquivos:** `src/app/assinatura/` — hook central `useAssinaturaPage.ts`

### Steps (máquina de estados)

```
"register" → "plan" → "select" → "processing" → "payment" (PIX)
                                                          ↓
                                               "success" (polling)
                                                          ↓
                                               "completed" → /vendedor/criar-loja
```

| Step | Componente | Quando exibido |
|---|---|---|
| `register` | `RegisterStep.tsx` | Usuário não autenticado |
| `plan` | `PlanSelectionStep.tsx` | Autenticado sem plano pré-selecionado |
| `select` | `SelectPaymentMethodStep.tsx` | Plano escolhido, aguarda método de pagamento |
| `processing` | `ProcessingStep.tsx` | POST /subscriptions em andamento |
| `payment` | `PaymentStep.tsx` | PIX — exibe QR code para escanear |
| `success` | `SuccessStep.tsx` | Cartão/Boleto — aguarda confirmação via polling |
| `completed` | `CompletedStep.tsx` | Assinatura ativa confirmada |

### Parâmetros de URL suportados
| Param | Efeito |
|---|---|
| `?plano={slug}` | Pré-seleciona o plano; pula PlanSelectionStep |
| `?cycle=monthly\|yearly` | Pré-seleciona ciclo (fallback: localStorage `subscription-cycle-pref`) |

> ⚠️ **Bug conhecido:** `PricingSection.tsx` da landing gera links com `?plan=` (sem "o"), mas `useAssinaturaPage.ts` lê `searchParams.get("plano")` (com "o"). O pré-selecionamento de plano a partir da landing não funciona. O parâmetro correto lido pelo hook é `?plano=`; a landing precisa ser corrigida para usar `?plano=`.
| `?trial=true` + `?plano={slug}` | Auto-dispara trial sem exibir SelectPaymentMethodStep |

### RegisterStep — dados coletados
| Campo | Regras |
|---|---|
| Nome | obrigatório, min 3 chars |
| E-mail | obrigatório, formato e-mail |
| WhatsApp | obrigatório, 8–15 dígitos, seletor de país (PhoneCountryInput, default BR) |
| Senha | obrigatório, 8+ chars, 1 maiúscula, 1 número |
| Confirmação de senha | deve coincidir |

- Mostra requisitos de senha em tempo real (checklist)
- Alterna entre "criar conta" e "entrar" na mesma tela
- Botão Google OAuth em ambos os modos
- Se plano já estava selecionado antes de autenticar → exibe card de preview do plano

**Calls:** `POST /user/register` → `AuthContext.login()` → resolve step

### PlanSelectionStep — seleção de plano
- Toggle mensal/anual no topo; badge de % economia anual se aplicável
- Grid de 3 planos; plano `plano-pro` → badge "Mais popular"
- Ícone por slug: básico → Zap, pro → Flame, max → Star
- Se `plan.trial_days > 0`: botão "Começar grátis por X dias" (dispara trial direto)
- Plano sem preço anual: card com `opacity-50`, botão desabilitado para ciclo anual

### SelectPaymentMethodStep — pagamento
**Painel esquerdo (resumo do plano):**
- Nome, preço, ciclo, features list
- Se cupom aplicado: preço riscado + badge com código + desconto + duração

**Cupom:**
- Link "Tenho um cupom" → abre input
- `POST /subscriptions/validate-coupon` → `{ code, plan_slug, billing_cycle }`
- Resposta com `final_price <= 0` → `isFreeCheckout = true`
- Labels de duração: `"forever"` → "em todas as renovações" | `"once"` → "apenas no 1º pagamento" | `"months"` → "pelos próximos X meses"

**Painel direito (método):**
- Se `isFreeCheckout`: box verde "R$ 0,00 — sem cobrança"; oculta botões de pagamento
- Botões: Cartão de Crédito / PIX / Boleto
- PIX e Boleto: exibe toggle CPF/CNPJ + input formatado (formatCPF / formatCNPJ de `lib/utils.ts`)
- Botão "Continuar" desabilitado até `canContinue = true`
  - `canContinue = false` se: mutation pendente | precisa método mas nenhum selecionado | precisa documento mas faltando/incompleto

### Fluxo após submit (`handleCreateSubscription`)
```ts
POST /subscriptions {
  billing_type?,       // CREDIT_CARD | PIX | BOLETO
  cpf? | cnpj?,        // obrigatório para PIX/Boleto
  plan_slug?,
  billing_cycle?,      // monthly | yearly
  coupon_code?,
  start_trial?         // true → trial
}
```

| Resultado | Próximo step |
|---|---|
| Trial OU cupom 100% (`payment_provider: 'free'`) | `"processing"` → `"completed"` |
| PIX (`qr_code` presente na resposta) | `"payment"` (exibe QR code) |
| Cartão/Boleto | `"success"` (polling inicia) |

### PaymentStep — QR code PIX
- Imagem 64×64 (mobile) / 80×80 (desktop) do QR base64 (aceita `data:image/...` ou URL)
- Botão "Abrir Link de Pagamento" → `window.open(payment_url)`
- Se imagem falhar ao carregar: oculta `<img>`, exibe mensagem fallback

### SuccessStep — polling de confirmação
- Polling: `GET /subscriptions/me` a cada 5s via `useMySubscription(refetchInterval: 5s)`
- `isPaymentConfirmed = true` quando `subscription.status === 'active'` ou `payments[].status === 'paid'`
- Confirmado → limpa localStorage, refreshToken, vai para `"completed"`

### CompletedStep — tela final
| Reason | Ícone | Título | Observação |
|---|---|---|---|
| `trial` | ✨ azul | "Trial ativado!" | Exibe data de expiração formatada (pt-BR) |
| `coupon` | 🎫 verde | "Acesso liberado!" | Exibe código do cupom + data |
| `paid` | ✓ verde | "Assinatura Confirmada!" | — |

- Botão "Criar minha loja" → `router.push('/vendedor/criar-loja')`

### Backend: `POST /subscriptions`
```ts
// CreateSubscriptionDto
{
  billing_type?: 'CREDIT_CARD' | 'PIX' | 'BOLETO'  // default: CREDIT_CARD
  cpf?: string          // obrigatório para PIX/BOLETO
  cnpj?: string         // alternativa ao CPF
  plan_slug?: string    // default: primeiro plano ativo
  billing_cycle?: 'monthly' | 'yearly'  // default: monthly
  coupon_code?: string
  start_trial?: boolean // requer plan.trial_days > 0
}
```

**Fluxo no service:**
1. Verifica se usuário já tem assinatura ativa → rejeita
2. Valida `plan_slug` → carrega PLAN
3. Se `coupon_code`: valida + reserva atomicamente (tryReserveUsage com SQL atômico)
4. Calcula preço final com desconto
5. **Caminho free** (trial OU cupom 100%):
   - Não chama Asaas
   - SUBSCRIPTION.status = `'active'`, free_access_until = now + trial_days
   - Promove USER.profile → `'Vendedor'`
6. **Caminho pago:**
   - Cria/busca cliente Asaas (`getOrCreateAsaasCustomer`)
   - Cria assinatura recorrente no Asaas
   - SUBSCRIPTION.status = `'pending'`
   - Retorna `{ subscription, payment_url, qr_code }`

**Webhook Asaas (`POST /subscriptions/webhook`):**
- `PAYMENT_CONFIRMED` → status = `'active'`, periods atualizados, promove USER → `'Vendedor'`, envia e-mail de ativação
- `PAYMENT_OVERDUE` → status = `'expired'`
- `PAYMENT_DELETED / PAYMENT_REFUNDED` → cancela

---

## 4. Wizard de Criação de Loja (`/vendedor/criar-loja`)

**Arquivos:** `src/app/vendedor/criar-loja/`

### Guard de acesso
- Rota está na **lista de exceções** do layout (`/vendedor/criar-loja`) — não exige assinatura ativa
- Exige: usuário autenticado + `profile === 'Vendedor'`
- Se loja já existe: exibe tela "loja já criada" com CTA → `/vendedor`

### Passo 1 — Informações Básicas
| Campo | Tipo | Regras |
|---|---|---|
| `name` | text | required, 3–100 chars |
| `description` | textarea | opcional, max 500 chars |
| `logo` | file | PNG/JPG, max 2MB, preview imediato |
| `banner` | file | PNG/JPG, proporção 3:1, max 2MB |

- Slug gerado em tempo real (`utils/social.ts > slugify()`) → exibe preview da URL `/loja/{slug}`

### Passo 2 — Nicho
| Campo | Tipo | Regras |
|---|---|---|
| `niche_ids[]` | multi-select | required, mínimo 1 |

- Fonte: `GET /niches` via `useAllNiches()`
- Toggle visual: clique ativa/desativa; fundo navy = selecionado
- Contador de selecionados com ícone de check verde

### Passo 3 — Contato
| Campo | Tipo | Regras |
|---|---|---|
| `whatsapp` | phone | required, 8–15 dígitos, seletor de país |
| `email` | email | required |
| `instagram` | text | opcional, URL completa construída via `toInstagramUrl()` |
| `facebook` | text | opcional, URL completa construída via `toFacebookUrl()` |

- País selecionável com código discagem; lista de `restcountries.com` (cache 24h)
- Código do país é prefixado automaticamente no `whatsapp` antes do POST

### Submit — `POST /stores` (multipart/form-data)
```ts
FormData {
  name, description?,
  niche_ids[],
  logo?: File, banner?: File,
  whatsapp, email,
  instagram?, facebook?
}
```
- Sucesso: toast + invalidate cache `'store'` + `router.push('/vendedor')`
- Erro: array de mensagens exibido via toast

### Componentes de UI específicos
- `NavBar.tsx` — barra inferior: Voltar + Próximo/Criar (disabled durante submit)
- `LeftPanel.tsx` — sidebar desktop com indicadores de step (concluído / ativo / pendente)
- `ProgressTrack.tsx` — barra de progresso horizontal (desktop, 3 segmentos)
- `MobileStepper.tsx` — dots + label (mobile)
- `FileUploadZone.tsx` — drag-and-drop com preview

### Validação progressiva
- Real-time: cada campo valida ao perder foco
- Step-level: ao clicar "Próximo", valida schema do step atual via Yup
- Full: antes do submit final, valida schema completo
- Primeiro step com erro recebe foco automático

---

## 5. Dashboard + Checklist (`/vendedor`)

**Arquivos:** `src/app/vendedor/page.tsx`, `src/hooks/useOnboardingChecklist.ts`

### Redirect automático
```ts
// page.tsx
if (!store) router.push('/vendedor/criar-loja')
```
Vendedor sem loja nunca vê o dashboard — é redirecionado na hora.

### Checklist de onboarding
Exibida na home enquanto houver itens incompletos. 11 itens:

| # | Item | Rota de destino |
|---|---|---|
| 1 | Logo da loja | `/vendedor/configuracoes/informacoes-basicas` |
| 2 | Banner da loja | `/vendedor/configuracoes/informacoes-basicas` |
| 3 | Descrição da loja | `/vendedor/configuracoes/informacoes-basicas` |
| 4 | Endereço | `/vendedor/configuracoes/endereco` |
| 5 | Canais de contato | `/vendedor/configuracoes/contatos` |
| 6 | CNPJ | `/vendedor/configuracoes/documentos` |
| 7 | Horário de funcionamento | `/vendedor/configuracoes/horario` |
| 8 | Configurar entrega | `/vendedor/configuracoes/entrega` |
| 9 | Métodos de pagamento | `/vendedor/configuracoes/pagamento` |
| 10 | Criar categorias | `/vendedor/categorias` |
| 11 | Criar primeiro produto | `/vendedor/produtos/criar` |

- **Primeiro item incompleto** → botão primário (azul), destaque visual
- Demais → botão ghost
- Item concluído → checkbox preenchido, texto riscado
- Checklist some quando todos os itens estiverem concluídos

---

## 6. Wizard de Criação de Produto (`/vendedor/produtos/criar`)

**Arquivos:** `src/app/vendedor/produtos/criar/`

Ver [`SPEC_produto-crud.md`](./SPEC_produto-crud.md) para detalhes completos. Resumo do fluxo:

### 4 passos

**Passo 1 — Informações básicas**
- Nome (required, min 3), descrição, preço, preço promocional, destaque

**Passo 2 — Variantes e estoque**
- Nicho → campos dinâmicos baseados em `NicheField[]` (ver [`SPEC_niches-campos.md`](./SPEC_niches-campos.md))
- Cor (`variant_dimension='color'`) → `availableColors[]` → grid de estoque
- Tamanho/Numeração (`variant_dimension='size'`) → `availableSizes[]` → grid de estoque
- Grid: cores × tamanhos (2D) ou só cores (lista) ou só tamanhos (lista)
- `niche_id` sempre enviado no payload, mesmo sem campos preenchidos (fix de validação required)

**Passo 3 — Imagens**
- Com cores: `ImageUploadByColor` — abas por cor, mínimo 2 imagens por cor
- Sem cores: `ImageUpload` — 2–5 imagens simples

**Passo 4 — Especificações (opcional)**
- Editor de texto rico para detalhes técnicos
- Dados fiscais (NCM, origem, unidade, GTIN, CEST)

### Ações
- "Salvar rascunho" → `save_as_draft: true`
- "Publicar" → produto fica visível na loja
- Listagem vazia → empty state com CTA "Criar Produto"

---

## 7. Ciclo de vida da assinatura (backend)

### Modelos Prisma envolvidos
```
USERS ←1:1→ SUBSCRIPTION ←N:1→ PLAN
                    ↓
              PAYMENT[]
                    ↓
           PLAN_COUPON (opcional)
```

### Status da SUBSCRIPTION
| Status | Significado |
|---|---|
| `pending` | Aguardando confirmação de pagamento Asaas |
| `active` | Assinatura válida; vendedor tem acesso |
| `expired` | Pagamento vencido ou período expirado |
| `canceled` | Cancelada pelo usuário ou falha permanente |

**Grace period:** `cancel_at_period_end=1` mantém `status='active'` até o cron expirar no `current_period_end`.

### Status do PAYMENT
| Status | Significado |
|---|---|
| `pending` | Aguardando Asaas |
| `paid` | Confirmado (webhook) |
| `failed` | Falhou/rejeitado |
| `refund_requested` | Solicitado pelo usuário (admin processa) |
| `refunded` | Estorno confirmado |

### Endpoints disponíveis
| Método | Rota | Descrição |
|---|---|---|
| GET | `/subscriptions/plans` | Lista planos ativos (público) |
| POST | `/subscriptions/validate-coupon` | Valida cupom + preview de preço (público) |
| POST | `/subscriptions` | Cria assinatura (JWT) |
| GET | `/subscriptions/me` | Minha assinatura + histórico (JWT) |
| DELETE | `/subscriptions` | Cancela com grace period (JWT) |
| POST | `/subscriptions/renew` | Renova após cancelamento (JWT) |
| POST | `/subscriptions/preview-change-plan` | Preview de mudança de plano (JWT) |
| POST | `/subscriptions/change-plan` | Muda de plano (JWT) |
| GET | `/subscriptions/payments` | Histórico paginado (JWT) |
| POST | `/subscriptions/refund` | Solicita estorno (até 7 dias, JWT) |
| GET | `/subscriptions/payments/:id/link` | Link/QR para pagamento pendente (JWT) |
| POST | `/subscriptions/webhook` | Webhook Asaas (token header) |

### Mudança de plano
- **Upgrade (mesmo ciclo, preço maior):** cobrança proporcional imediata; plano muda após webhook confirmar
- **Downgrade (mesmo ciclo, preço menor):** agendado para `current_period_end`; sem cobrança
- **Troca de ciclo:** agendado para `current_period_end`; novo preço do ciclo aplicado na renovação

### Crons (execução horária + diária)
| Frequência | Job | Ação |
|---|---|---|
| Horária | `syncExpiredSubscriptions` | Expira subs além do `current_period_end` (fallback de webhook) |
| Horária | `expireFreeAccess` | Expira trial/cupom; reverte USER para `'cliente'` |
| Horária | `applyScheduledPlanChanges` | Aplica downgrade/troca-ciclo agendado |
| Diária | `cleanupOrphanProrations` | Remove cobranças de upgrade não pagas no Asaas |
| Diária | `dailySubscriptionAudit` | Alerta se sub ativa com `period_end` > 5 dias atrasado |

### Cupons (PLAN_COUPON)
- `discount_type`: `'percent'` ou `'fixed'`
- `duration_type`: `'once'` | `'months'` | `'forever'`
- `applies_to_cycle`: `'monthly'` | `'yearly'` | `'both'`
- Reserva atômica via SQL UPDATE condicional (evita race condition)
- Expiração automática: a cada renovação decrementa `discount_remaining_periods`; quando chega a 0, restaura preço original no Asaas

---

## 8. Guard de acesso no layout do vendedor

**Arquivo:** `src/app/vendedor/layout.tsx`

```ts
// Hierarquia de bloqueios
1. !user → redirect /login
2. profile !== 'Vendedor' → <AccessDenied />
3. subscription.status em ['canceled','expired','pending']
   E rota NÃO está em ['/vendedor/plano', '/vendedor/criar-loja']
   → <SubscriptionBlocked />
```

**Rotas de exceção** (não verificam assinatura):
- `/vendedor/plano` — gerenciar/renovar assinatura
- `/vendedor/criar-loja` — wizard de criação de loja

---

## 9. Armadilhas conhecidas

| Problema | Causa | Solução |
|---|---|---|
| Vendedor criou conta mas pagamento PIX ainda não confirmado | SUBSCRIPTION.status = 'pending' | Layout mostra `<SubscriptionBlocked>` com CTA para /vendedor/plano + botão "Ver QR Code" |
| Trial expirou durante o uso | Cron `expireFreeAccess` rodou | USER.profile reverte para 'cliente'; próximo request ao guard bloqueia acesso |
| Webhook do Asaas chegou duplicado | Mesmo `payment_id` processado duas vezes | Idempotência: verifica existência de PAYMENT com mesmo `payment_id` antes de criar |
| Cupom esgotado por race condition | Dois usuários usaram o mesmo cupom ao mesmo tempo | SQL atômico: `UPDATE WHERE used_count < max_uses` — só um dos requests incrementa |
| Campos required de nicho ignorados | Produto enviado sem `niche_id` | `niche_id` sempre enviado no FormData do frontend; `validateRequiredNicheFields()` roda incondicionalmente |

---

## 10. Referências cruzadas

- [`DESIGN_SPEC.md`](./DESIGN_SPEC.md) — tokens, componentes, tipografia (painel vendedor)
- [`SPEC_produto-crud.md`](./SPEC_produto-crud.md) — wizard de produto completo, variantes, imagens por cor
- [`SPEC_niches-campos.md`](./SPEC_niches-campos.md) — nichos, `variant_dimension`, `field_type` canônico
- [`SPEC_admin.md`](./SPEC_admin.md) — gerenciamento de planos, cupons e estornos pelo admin
