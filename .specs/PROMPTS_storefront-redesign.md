# Prompts — Redesign do Storefront (Claude Design)

> Um prompt por tela do storefront público (`/loja`), para gerar **telas vivas** (design comps de alta fidelidade) no Claude Design.
> Base: o [Diagnóstico de Design do Storefront](https://claude.ai/code/artifact/7dd3ab74-0d08-4ede-952a-4bd7744cea64) (nota 6.8/10) e o `.specs/DESIGN_SPEC.md`.

## Como usar

1. **Sempre cole o `BLOCO 0 — Contexto compartilhado` antes** de qualquer prompt de tela. Ele é a constituição de design; os prompts de tela só descrevem o que muda naquela tela.
2. Peça **desktop E mobile** de cada tela (o mobile é a maioria do tráfego e onde estão os piores gaps).
3. Peça os **estados** listados em cada tela (loading, vazio, erro, hover, foco) — não só o "happy path".
4. Depois de aprovar o comp, ele vira referência para a implementação em código (Next + Tailwind + tokens `nx*`).

---

# BLOCO 0 — Contexto compartilhado

> **Cole este bloco no início de todos os prompts de tela.**

## O produto

**Nexo** é uma plataforma **multi-tenant** de e-commerce (tipo Shopify BR): cada lojista tem sua própria loja pública em `/loja/[slug]`. Você vai redesenhar as telas dessa **vitrine pública** (o storefront que o **cliente comprador** vê) — não o painel do vendedor.

Stack real: Next.js 14 (App Router) + React + TypeScript + Tailwind + shadcn/ui. Fontes via `next/font`. Ícones **Lucide** exclusivamente. Sem framer-motion no storefront (animação é CSS).

**Particularidade do modelo:** o pagamento é **negociado e concluído no WhatsApp**. O checkout coleta os dados e abre uma conversa no WhatsApp da loja — o cliente não paga com cartão no site. Isso precisa ficar claro e tranquilizador no checkout e no sucesso.

## O norte do design: "Editorial Boutique OS"

Toda loja Nexo deve parecer **feita sob medida para o lojista**, e ao mesmo tempo ser inconfundivelmente bem-construída porque o mesmo **chassi invisível do Nexo** comanda todas elas.

- A **plataforma é dona da gramática**: eyebrow mono-uppercase sobre título display, CTAs em pill, cards `rounded-2xl`, uma assinatura de motion única, rodapé escuro (coal). Tudo por **uma única camada de tokens**.
- A **marca do lojista preenche o chassi**: a **cor de accent do lojista** atravessa hero, CTAs, focus, badges e filtros; o **monograma, a fotografia e as categorias** dele carregam a individualidade.
- O **índigo Nexo recua para a chrome da plataforma** (badge "Loja por Nexo", powered-by). Uma loja de café não deve parecer "a cara do Nexo".

> ⚠️ O storefront **não** é o painel do vendedor. O `DESIGN_SPEC.md` descreve a estética densa de *ferramenta* do painel. O storefront é uma **vitrine editorial**: mais respiro, tipografia display, ritmo de revista, fotografia protagonista. Use os **tokens** do sistema, mas **não** a densidade do painel.

## Tokens de cor (use os valores CORRIGIDOS abaixo — não os bugados do código atual)

Defina como CSS vars no comp. Valores-alvo (já com as correções do diagnóstico):

```
/* Chrome da plataforma Nexo (uso restrito) */
--nxp:        #2A2D7C   /* índigo Nexo — SÓ chrome: badge "Loja por Nexo", powered-by */
--coal:       #070815   /* superfície escura (rodapé, faixas) — mesma do painel auth */

/* Accent do LOJISTA (é o que pinta a loja) — nesta loja de exemplo: */
--store-accent:      #2F6B4F   /* verde-floresta (Bendito Grão) */
--store-accent-ink:  #1E4A36   /* variação escura p/ texto sobre claro */
--store-accent-soft: rgba(47,107,79,0.08)

/* Tinta / superfícies (corrigidos para AA) */
--nxi1:  #1B2030   /* tinta forte — títulos */
--nxi2:  #545B6E   /* tinta média — corpo */
--nxi3:  #6E7488   /* tinta suave — CORRIGIDO p/ ~4.5:1; nunca abaixo disso em texto <14px */
--nxsurf:#FBFAF7   /* off-white — superfície de card (CORRIGIDO; hoje renderiza branco) */
--nxbg:  #F3F4F8   /* fundo de página */
--nxborder:#E6E7EE /* borda/hairline */

/* Semânticos (não são accent) */
--nxs: #3F8A66   /* sucesso / verde */
--nxw: #E8A33D   /* aviso / âmbar — use aqui p/ estrelas de avaliação */
--nxd: #C13A2E   /* erro / destrutivo / wishlist ativa */
--wa:  #25A15A   /* verde WhatsApp */
```

**Regra de ouro do accent:** onde hoje a loja usa `nxp` (índigo) como destaque — hero, CTA, filtro ativo, chip, focus ring, badge de tamanho selecionado — troque por `--store-accent`. O `nxp` só aparece na chrome Nexo.

## Tipografia

- **Integral CF** (`font-integral`) — **voz display**. Use nos H1 do hero e H2 de seção. Hoje ela é desperdiçada só como marca d'água a 5% — **promova para os títulos reais**, e mantenha o monograma gigante como marca d'água (a fonte lê em duas escalas).
- **Nunito** (`font-sans`) — corpo, UI, botões.
- **Mono** — os "eyebrows" (micro-labels uppercase). Defina uma mono real e intencional (ex.: um grotesco mono). **Não** deixe cair no monospace do SO. **Unifique o eyebrow a UM tamanho** em toda a loja — ele é a assinatura.
- Escala tipográfica **governada** (nada de meio-pixel `text-[12.5px]`): pense em ~6 papéis (display / h2 / preço / corpo / meta / eyebrow) e fique neles.
- Tracking negativo em títulos display (`-0.03em`). Eyebrow com tracking positivo (`0.18em`) uppercase.

## Motion

- Uma assinatura de easing única: `cubic-bezier(.22,1,.36,1)`.
- Entradas com **fade + rise** (opacidade + translateY), não só slide.
- Micro-interações de hover em cards (zoom sutil na imagem, quick-add que sobe). `active:scale-[.97]` nos botões.
- Marquee/rows com **máscara de gradiente nas bordas** e pause-on-hover.
- Respeite `prefers-reduced-motion` (o sistema já faz isso — mantenha).

## Acessibilidade (obrigatório — o diagnóstico reprovou AA em todas as telas)

- Todo controle interativo tem **`focus-visible` visível** (ring de 2px na cor `--store-accent`, com offset). Isto **não é opcional**.
- Texto pequeno nunca abaixo de ~4.5:1 (use `--nxi3` corrigido, não mais claro).
- Alvos de toque **≥ 44px**.
- Contraste do accent sobre fundos claros/escuros sempre legível.

## 🚫 Proibido — design genérico e com cara de IA

O cliente já rejeitou propostas com "cara de template" e "cara de IA". **Evite explicitamente:**

- ❌ Creme quente (`#F4F1EA`) + serifada display + terracota — o clichê de IA nº1.
- ❌ Preto quase-puro com um único verde-limão/vermelho-ácido de destaque.
- ❌ Gradiente roxo→azul em hero sobre branco.
- ❌ **Inter** ou **Space Grotesk** como fonte "segura" — a voz aqui é **Nunito + Integral CF**.
- ❌ Emoji como marcador de seção.
- ❌ Tudo centralizado; `rounded-lg` em tudo; "barrinha de cor no topo de card arredondado" como muleta.
- ❌ Numeração decorativa `01/02/03` onde não há sequência real.
- ❌ Três cards iguais lado a lado como resposta preguiçosa — busque **ritmo** (bento, assimetria intencional, escala variada).
- ❌ Sombra roxa difusa padrão de template — sombras só na linguagem de elevação dos tokens.
- ❌ Ícone de "check em círculo" repetido como enfeite — estrutura (eyebrow, número, divisor) só quando **codifica algo verdadeiro**.

**Em vez disso:** editorial, intencional, com **uma aposta ousada por tela concentrada num só lugar** e o resto quieto. Fotografia de produto é protagonista; a UI é moldura. Gaste a ousadia onde ela serve à compra.

## Loja de exemplo (mock) — use em TODAS as telas para coerência

**Bendito Grão — Café Especial** (de propósito **não é moda**, para provar que a loja se adapta ao nicho).

- Slug: `bendito-grao` · Monograma: **B** · Cidade: São Paulo, SP
- Accent da marca: **verde-floresta `#2F6B4F`**
- Frete grátis acima de **R$ 149** · Entrega SP capital em **2–4 dias**
- WhatsApp: `(11) 98812-4590`
- Eyebrow/hero da loja: *"Torrado toda semana · direto do produtor"*
- Categorias: **Grãos** (18) · **Métodos** (12) · **Moedores** (6) · **Acessórios** (24) · **Presentes** (9)

**Produtos mock:**

| Produto | Categoria | Preço | Estado | Nota |
|---|---|---|---|---|
| Café Bourbon Amarelo — Torra Média (250g) | Grãos | R$ 62,90 | variação: moagem (Grão/Coado/Espresso/Prensa) | 4.8 (214) |
| Prensa Francesa Vidro 350ml | Métodos | R$ 139,00 ~~R$ 169,00~~ | promo −18% | 4.7 (98) |
| Kit Coador Hario V60 + 40 filtros | Métodos | R$ 118,00 | **NOVO** | 4.9 (156) |
| Moedor Manual Inox | Moedores | R$ 249,00 | — | 4.6 (72) |
| Xícara Cerâmica Fosca 200ml | Acessórios | R$ 49,00 | cores: Areia / Musgo / Grafite | 4.8 (203) |
| Clube do Café — Assinatura mensal | Presentes | a partir de R$ 89,00/mês | recorrente | 5.0 (41) |

**Pedido mock (checkout / sucesso):** `#BG-2049` · 2× Café Bourbon Amarelo + 1× Prensa Francesa · Subtotal R$ 264,80 · Cupom `PRIMEIRACOMPRA` (−10%, −R$ 26,48) · Total **R$ 238,32** · Cliente: Marina Alves · Endereço: Rua das Palmeiras, 320 — Pinheiros, São Paulo/SP.

---

# TELA 1 — Home da loja

**Rota:** `/loja/[slug]` · **Componentes reais:** `StoreHeader`, `StoreHomeHero`, `StoreMarquee`, `StoreCategoryPills`, `StoreCollectionSection`, `StoreFeatureBanner`, `StoreProductRow`, `StoreHomeCard`, `StoreNewFooter`, `StoreSearchDropdown`, `WhatsAppChatWidget`.

> Cole o **BLOCO 0** antes deste prompt.

**Objetivo:** a vitrine principal — primeira impressão, navegação por categoria, coleção em destaque e novidades/ofertas, tudo levando ao produto.

**Estado atual (nota 6.5):** já tem personalidade (hero índigo com monograma, gramática de seção, bento na coleção), mas está inacabado em pontos que um sênior nota na hora.

**O que melhorar (do diagnóstico):**
- **Voz display:** título do hero e H2 de seção em **Integral CF** (hoje é tudo Nunito bold; a Integral só aparece como marca d'água). Mantenha o monograma gigante ao fundo.
- **Accent do lojista:** hero, CTAs, pílula de categoria ativa e quick-add pintados com `--store-accent` (verde), **não** índigo Nexo.
- **Dropdown de busca (crítico):** hoje está numa paleta bege de outra marca com sugestões de moda fixas (`"vestido midi"`). Refazer no design system, e o estado sem-busca deve mostrar **as categorias reais da loja + mais vendidos** (ex.: "Café Bourbon", "Prensa Francesa"), nunca termos inventados.
- **Bento da coleção:** o card em destaque (2×2) deve **preencher a célula** com a imagem cobrindo e a legenda sobre um scrim no rodapé (hoje desalinha).
- **Tablet:** resolver o hero no breakpoint md (hoje o showcase some e sobra um bloco vazio à direita) — ou banda de imagem full-width abaixo da copy, ou tratamento de monograma cortado.
- **Marquee de promessas:** máscara de gradiente nas bordas + pausa no hover (hoje corta seco).
- **A11y:** `focus-visible` em card de produto, wishlist, quick-add, toggles e ícones do header; ícones do header com alvo ≥44px; `nxi3` legível.
- **Monograma único:** um só sistema (1 letra marca d'água / 2 letras no header e rodapé) — hoje há três tratamentos diferentes.
- **Estrelas:** cor `--nxw` (âmbar), não `amber-400` cru.

**Blocos e mock a mostrar (na ordem):**
1. **Announcement bar** (dispensável): *"Frete grátis acima de R$ 149 · Torrado toda semana"*.
2. **Header** sticky com blur: monograma **B** + "Bendito Grão", busca central, carrinho (2), conta.
3. **Hero**: eyebrow *"Torrado toda semana · direto do produtor"*, título display (ex.: *"Café que respeita o tempo do grão."*), subtítulo curto, 2 CTAs em pill (verde sólido "Explorar coleção" + contorno "Ver novidades"), chips de confiança (frete grátis, entrega SP 2–4 dias). Showcase: card do **Café Bourbon Amarelo** com card rotacionado atrás.
4. **Marquee** de promessas (torra semanal · frete grátis · troca fácil · atendimento no WhatsApp).
5. **Pílulas de categoria** com contagem (Todos · Grãos 18 · Métodos 12 · Moedores 6 · Acessórios 24 · Presentes 9) e underline deslizante.
6. **Coleção em bento** — 6 produtos do mock, 1º em destaque 2×2, com quick-add no hover, badge de promo/novo, swatches de cor onde houver.
7. **Feature banner** (campanha "Clube do Café") — sem wash de cor forçado sobre a foto.
8. **Row "Novidades"** e **Row "Ofertas da semana"** (scroll horizontal com máscara nas bordas).
9. **Rodapé coal** com glow do accent, trust strip, redes, e badge discreto **"Loja por Nexo"** (aqui sim, índigo Nexo).
10. **Widget WhatsApp** flutuante.

**Estados:** skeleton da coleção; empty state (busca sem resultado, com CTA "Limpar filtros"); dropdown de busca (sem-query com categorias+mais-vendidos, com resultados, e sem-resultado).

**Entregável:** tela viva desktop (largura ~1280px) + mobile (375px), com hover do card e dropdown de busca aberto.

---

# TELA 2 — Listagem de produtos (PLP)

**Rota:** `/loja/[slug]/produtos` · **Componentes reais:** `Store/Plp/*` (`PlpHero`, `PlpToolbar`, `PlpFilterRail`, `PlpFilterPanel`, `PlpFilterDrawer`, `FilterGroup`, `CheckRow`, `PlpActiveChips`, `PlpProductGrid`, `PlpListRow`, `PlpLoadMore`, `PlpEmptyState`).

> Cole o **BLOCO 0** antes deste prompt.

**Objetivo:** catálogo filtrável — encontrar produto rápido, com filtros por categoria/preço/atributo e 3 densidades de visualização.

**Estado atual (nota 7):** bem construído (rail sticky, swatches com luminância, "carregar mais" com progresso, toggle de densidade), mas sem um gesto de destaque e com dívidas de a11y.

**O que melhorar (do diagnóstico):**
- **Hero merchandised:** trocar a faixa de texto fina por um hero por nicho (imagem de categoria ou wash sutil na cor do lojista) com **breadcrumb + título em Integral CF + contagem única**. Hoje a contagem aparece 2× (hero + toolbar) — colapsar numa só.
- **Sub-barra sticky:** quando o hero rola, fixar uma barra fina sob o header com `[título · N resultados · ordenar · densidade]`, para o **ordenar não sumir** ao rolar (hoje o rail fica fixo mas o toolbar some).
- **Filtro de preço:** refazer como **dual-thumb (mín + máx)** com dois inputs numéricos e um **histograma** sutil de distribuição de preços atrás do trilho (hoje é slider de thumb único, só máximo).
- **Accent do lojista** em filtros ativos, chips, radios de nota, seleção e hover de "carregar mais".
- **A11y (crítico):** o **drawer de filtros mobile** cumpre o contrato de modal — trava scroll do body, fecha no Esc, prende foco, restaura foco ao fechar, e tem animação de saída. `focus-visible` em cards, chips, selects e botões de filtro. Restaurar outline do `<select>` de ordenar.
- **Um só "limpar filtros":** um rótulo/estilo canônico no rail e no drawer; a linha de chips só remove itens individuais (hoje há três variações).
- **Skeletons fiéis à densidade** (grid vs lista) com placeholder de imagem + 2 linhas + preço; entrada com fade+rise.
- **Estrelas** em `--nxw`.

**Mock a mostrar:**
- Hero da categoria **"Métodos"** (ou "Todos os produtos") com breadcrumb `Início › Métodos`, título e **"12 produtos"** (contagem única).
- Rail de filtros: **Categoria** (checkboxes com contagem), **Preço** (dual-thumb R$0–R$300 + histograma), **Avaliação** (4★+ etc.), **Atributos por nicho** (ex.: Torra: Clara/Média/Escura; Origem: Cerrado/Sul de Minas). Badges de contagem por grupo.
- Grid com os produtos do mock; chips ativos ("Métodos ✕", "4★+ ✕", "Limpar filtros (2)").
- "Carregar mais" como barra: *"Mostrando 6 de 12"*.

**Estados:** grid / densidade compacta / lista; skeleton por densidade; **empty state** com filtros que não retornam nada; **drawer de filtros mobile** aberto (com o contrato de modal correto).

**Entregável:** desktop (rail + grid) + mobile (com drawer de filtros aberto).

---

# TELA 3 — Detalhe do produto (PDP)

**Rota:** `/loja/[slug]/produto/[id]` · **Componentes reais:** `Store/Product/*` (`ProductImageGallery`, `ProductPricing`, `ProductColorSelector`, `ProductSizeSelector`, `ProductStockLine`, `ProductAddToCart`, `ProductMobileBuyBar`, `ProductSubNav`, `ProductDescriptionSection`, `ProductSpecsSection`, `Stars`).

> Cole o **BLOCO 0** antes deste prompt.

**Objetivo:** a página que converte — galeria, buy box, variações, confiança, descrição, avaliações, perguntas, relacionados.

**Estado atual (nota 7):** buy box sticky, subnav scroll-spy, estoque por variação — bom. Mas 80% pronto: falta o rigor dos 20%.

**O que melhorar (do diagnóstico):**
- **Camada de confiança BR (a maior lacuna):** logo abaixo do preço, um **módulo desenhado** com: **parcelamento** (*"ou 12× de R$ 5,24 sem juros"*), **estimador de frete por CEP** inline, e uma linha de selos (*devolução fácil · compra segura · entrega estimada*). Trate como módulo, não lista.
- **Voz do kicker:** os micro-labels ("cor", "tamanho", categoria, seções) hoje caem em monospace do SO — usar a **mono intencional** do sistema.
- **Deduplicar conteúdo:** a descrição hoje aparece 2× e a categoria até 4×. Buy box recebe um **teaser curto** (1–2 linhas, visualmente distinto); a descrição completa fica só na seção; campos dinâmicos em **um** lugar (chips OU specs, não os dois). Badge de desconto em **um** lugar.
- **Galeria premium:** zoom no hover / lightbox no clique, **rail de miniaturas**, e um **aspect ratio único** com `object-contain` sobre fundo `nxsurf` para **nunca cortar** o produto. Reusar o motion de troca de cor.
- **Accent do lojista** em: tamanho selecionado, quantidade, "Adicionar à sacola", favoritado.
- **CTAs unificados:** desktop e barra mobile com **mesmo verbo** ("Adicionar à sacola") e mesma capacidade — a **barra mobile ganha controle de quantidade** e um resumo da variação (cor · tamanho).
- **A11y:** `focus-visible` em todos os controles de compra (add, quantidade, swatches, tamanhos, subnav, breadcrumb, favoritar/compartilhar); foco distinto do estado "selecionado".
- **Estado sem avaliação:** quando `totalReviews === 0`, **ocultar as 5 estrelas cinzas** (parecem "nota ruim") e mostrar só "Sem avaliações ainda".
- **Tamanho/opção esgotado:** estado bem mais forte (line-through + opacidade + rótulo claro).

**Mock a mostrar:** produto **"Café Bourbon Amarelo — Torra Média (250g)"** · categoria Grãos · R$ 62,90 · variação **moagem** (Grão / Coado / Espresso / Prensa) — uma delas esgotada · nota **4.8 (214)** · estoque "Últimas 7 unidades" · parcelamento 12× de R$ 5,24 · frete grátis acima de R$149. Seções: **Descrição** (origem Cerrado Mineiro, notas de caramelo e amêndoas), **Ficha técnica** (peso, torra, moagem, validade), **Avaliações**, **Perguntas**, **Relacionados** (Prensa Francesa, Coador V60).

**Estados:** galeria com lightbox aberto; buy box com CEP preenchido mostrando frete; barra de compra mobile fixa; opção esgotada; produto sem avaliações.

**Entregável:** desktop (galeria + buy box sticky) + mobile (com barra de compra fixa).

---

# TELA 4 — Checkout

**Rota:** `/loja/[slug]/checkout` · **Componentes reais:** `checkout/_components/*` (`CheckoutHeader`, `SectionCard`, `Field`, `CustomerDataSection`, `AddressSection`, `CouponSection`, `OrderSummary`, `WhatsAppFlowBanner`).

> Cole o **BLOCO 0** antes deste prompt.

**Objetivo:** coletar dados do cliente + endereço + cupom e finalizar **abrindo o WhatsApp da loja** (o pagamento é combinado lá). Tela de maior confiança do fluxo.

**Estado atual (nota 6.5):** arquitetura correta (coluna de cards + resumo sticky 380px), com detalhes bons (badges de etapa que viram check verde, ViaCEP com feedback, banner explicando o fluxo WhatsApp). Mas visualmente é um template neutro seguro, e tem gaps de a11y/conversão sérios.

**O que melhorar (do diagnóstico):**
- **Marca do lojista na chrome:** o header hoje diz "Checkout seguro" genérico. Colocar **logo/monograma + nome da loja** (Bendito Grão), com o cadeado como chip pequeno; tint das etapas e do CTA na cor do lojista. A tela de maior confiança tem que parecer da loja escolhida.
- **Stepper conectado:** desenhar uma **espinha** ligando os discos numerados (1→2→3) para ler como jornada; **ligar o `done` da etapa 3 (cupom)** — hoje ela nunca fica "completa".
- **Barra de pagamento fixa no mobile (crítico):** barra inferior fixa com **total à esquerda + "Finalizar pedido" à direita** e `safe-area` — hoje o total e o CTA ficam no fim de um scroll longo.
- **Formulário acessível (crítico):** `label` associado ao input (`htmlFor`), `aria-invalid`/`aria-describedby`, erros com `aria-live`; lista de endereços salvos como **`radiogroup` real**. **`autoComplete` + `inputMode` numérico** em CEP/número/CPF-CNPJ/telefone (impacto direto em conversão).
- **`focus-visible` visível** em CTA, aplicar cupom, cards de endereço, salvar/cancelar, links do header (hoje o ring do input é quase invisível a 15%).
- **Superfícies da loja:** cards em `nxsurf` com sombra em camadas (não brancos chapados), padding normalizado; o resumo sticky com elevação de verdade.
- **Um momento de marca/tipo:** o **Total** em destaque (peso maior, `tabular-nums`) e o accent do lojista destacando a **economia** (*"Você economiza R$ 26,48"*), não só no asterisco.
- **Validação com feedback:** erros inline nos campos de endereço (hoje só o CEP mostra erro; "Salvar endereço" com campo vazio não dá retorno).
- **CTA WhatsApp coerente:** deixar claro que finalizar **abre o WhatsApp** (ícone + microcopy); o banner de expectativa continua ótimo — mantenha.

**Mock a mostrar:** loja **Bendito Grão** no header. **Etapa 1 — Seus dados** (Marina Alves, e-mail, WhatsApp). **Etapa 2 — Entrega** (CEP 05422-030 → autopreenche Rua das Palmeiras, Pinheiros, São Paulo/SP; número/complemento; retirada na loja como opção). **Etapa 3 — Cupom** (`PRIMEIRACOMPRA` aplicado, chip verde −10%). **Resumo:** 2× Café Bourbon (R$ 125,80) + 1× Prensa Francesa (R$ 139,00) = subtotal R$ 264,80, desconto −R$ 26,48, entrega "combinada no WhatsApp", **Total R$ 238,32**. CTA **"Finalizar no WhatsApp"**.

**Estados:** etapa 1 completa (check verde) e etapa 2 em preenchimento; ViaCEP carregando → sucesso; carrinho vazio; barra de pagamento fixa no mobile.

**Entregável:** desktop (cards + resumo sticky) + mobile (com barra de pagamento fixa).

---

# TELA 5 — Pedido confirmado

**Rota:** `/loja/[slug]/pedido-sucesso` · **Componentes reais:** `pedido-sucesso/_components/*` (`SuccessHero`, `OrderRecap`, `OrderTimeline`, `SuggestionCard`, `WhatsAppContinueCard`).

> Cole o **BLOCO 0** antes deste prompt.

**Objetivo:** confirmar o pedido, dar o próximo passo (abrir o WhatsApp para combinar pagamento), mostrar o resumo e sugerir continuidade.

**Estado atual (nota 7):** o hero é ótimo (faixa índigo, ✓ desenhado em stroke + pop, código "ticket", copy personalizada). Mas perde altitude abaixo da dobra.

**O que melhorar (do diagnóstico):**
- **Accent do lojista no hero** (hoje índigo Nexo) — a confirmação é da loja, não da plataforma. Índigo Nexo só no badge "Loja por Nexo".
- **Ticket-keepsake (assinatura):** transformar o código do pedido num **ticket perfurado de verdade** — recortes laterais, perfuração tracejada entre rótulo e código, e um botão **"Copiar código" de 44px** que vira check "Copiado". Espelhar a mesma borda perfurada no topo do recap (código + recibo lidos como um artefato). Bônus: `@media print` para um comprovante limpo de 1 página.
- **Timeline de verdade:** refazer a "timeline" (hoje é grid 2×2 estático) como um **trilho horizontal** com linha de progresso que preenche até o nó ativo; no mobile, uma linha com snap-scroll (não 2×2, que embaralha a ordem). Onde houver status real do pedido, dirigir os nós por ele.
- **Recap completo:** usar os dados que já existem — **Subtotal → Desconto (com chip do cupom) → Total** + data/hora do pedido. Colorir só o **valor** do desconto (não o rótulo).
- **Um só WhatsApp:** suprimir o FAB flutuante nesta tela para o CTA "Abrir conversa" ser o único botão verde; considerar CTA sticky no mobile.
- **Próximos passos com peso:** "Continuar comprando" e "Acompanhar pedido" lado a lado, com peso visual igual, logo abaixo do card de WhatsApp (hoje ficam órfãos embaixo).
- **Upsell com intenção:** sugestões com quick-add + wishlist ("Adicione ao próximo pedido"); miniatura do recap em 3:4 como o resto da loja.
- **Tipo/container:** uma escala real (não 9/10/11.5px) e **um** container (hoje há 3 larguras desalinhadas: 760/1180/1280).

**Mock a mostrar:** hero com ✓, *"Pedido confirmado, Marina!"*, código **BG-2049** no ticket, copy *"Abrimos uma conversa no WhatsApp da Bendito Grão para combinar o pagamento."*. Card WhatsApp "Abrir conversa". Recap: 2× Café Bourbon + 1× Prensa Francesa, Subtotal R$ 264,80, Desconto −R$ 26,48 (cupom PRIMEIRACOMPRA), Total R$ 238,32, feito em 18/07 14:32. Trilho: *Pedido recebido ✓ · Combinar no WhatsApp (agora) · Preparando · A caminho*. Sugestões: Coador V60, Xícara Cerâmica, Moedor. Ações: "Continuar comprando" + "Acompanhar pedido".

**Estados:** hero com animação de check; ticket com hover/estado "Copiado"; sugestões com skeleton; versão mobile com CTA sticky.

**Entregável:** desktop + mobile, com o ticket e o trilho em destaque.

---

## Checklist de aprovação (todas as telas)

- [ ] Accent é o do **lojista** (verde), índigo Nexo só na chrome.
- [ ] H1/H2 em **Integral CF**; eyebrow mono unificado num tamanho; sem meio-pixel.
- [ ] **`focus-visible`** visível em todo controle; alvos ≥44px; `nxi3` legível (AA).
- [ ] Desktop **e** mobile; estados de loading/vazio/erro presentes.
- [ ] Nenhum item da lista **🚫 Proibido** (sem cara de template / IA).
- [ ] Conteúdo do **nicho certo** (café, não moda); mock coerente com a Bendito Grão.
- [ ] Uma aposta ousada por tela; fotografia protagonista; UI como moldura.
