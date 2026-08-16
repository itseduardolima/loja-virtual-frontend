# Plano de Implementação — Redesign da PDP

> Rota: `/loja/[slug]/produto/[id]` · Comp aprovado (Claude Design): https://claude.ai/code/artifact/de054744-6058-4e1f-a551-31c058535b5c
> Base: `.specs/PROMPTS_storefront-redesign.md` (TELA 3) + kit `src/components/Store/ui`.
> Nota: o estimador de frete por CEP foi **removido do escopo** (decisão de produto).

## Regra do plano: nada além da API

Tudo que a tela mostra deriva de campos que a API já retorna. Elementos do comp **cortados** por não existirem no backend:

- **Distribuição de estrelas** (barras 5★/4★/…) e "% recomendam" — o `summary` de reviews só traz `average_rating` e `total_reviews`.
- **Chip de variação comprada** e selo **"compra verificada"** nos reviews — `ProductReview` não traz variante nem flag.
- **Parcelamento** ("6× sem juros") — não existe config de parcelas.
- **Estimador de CEP** — sem endpoint de frete.
- **Escala ordinal na ficha** (Slim→Oversized) — sem metadado de nicho.

Campos usados e confirmados nos types: `brand_color`, `payment_methods`, `free_delivery_min`, `whatsapp`, `city`/`state` (StoreInfo); `dynamic_fields`, `specifications`, `variant_stocks`, `discount_percentage`, `final_price`, `colors`/`images_by_color` (Product); `summary.average_rating`/`summary.total_reviews` (Reviews).

## Diagnóstico do código atual (o que o plano corrige)

| Problema | Onde está hoje |
|---|---|
| CTA/seleções em índigo Nexo, não no accent do lojista | `ProductAddToCart` (`bg-nxp`), `ProductMobileBuyBar`, `ProductSizeSelector` (selecionado `bg-nxp`), `ProductColorSelector` (`ring-nxp`), `ProductSubNav` (indicador `bg-nxp`), dots da galeria mobile |
| `storeAccentStyle` **não é aplicado** na PDP (home e PLP já aplicam) | `page.tsx` — wrapper sem `style={storeAccentStyle(storeInfo)}` |
| Galeria corta o produto e não amplia | `ProductImageGallery` — stack vertical `object-cover`, sem zoom/lightbox/miniaturas |
| Sem camada de confiança (parcelamento/selos) | inexistente no buy box |
| Barra mobile com verbo diferente ("Comprar") e sem quantidade/variação | `ProductMobileBuyBar` |
| Descrição duplicada (buy box + seção) e dynamic_fields em 2 lugares | `page.tsx` linha ~276 + `ProductDescriptionSection`/`ProductSpecsSection` |
| Badge de desconto em 2 lugares | `ProductImageGallery` + `ProductPricing` |
| H1/H2 em Nunito bold — Integral CF só como marca d'água | `page.tsx` h1, seções |
| Estrelas em `amber-400` cru e 5 estrelas cinzas quando não há review | `Stars.tsx`, rating line do `page.tsx` |
| Esgotado fraco (só risco diagonal) | `ProductSizeSelector` |

---

## Fase 0 — Fundação de accent (pré-requisito, ~1h)

1. **`page.tsx`**: aplicar `style={storeAccentStyle(storeInfo)}` no `<div className="min-h-screen">` raiz (mesmo padrão de `loja/[slug]/page.tsx` e `produtos/page.tsx`).
2. Trocar `nxp` → `store` / `store-ink` (utilities já existem no Tailwind) em:
   - `ProductAddToCart`: CTA `bg-store hover:brightness-[1.05]` (ou migrar para `<StoreButton size="lg">`).
   - `ProductMobileBuyBar`: CTA idem.
   - `ProductSizeSelector`: selecionado `bg-store text-white`.
   - `ProductColorSelector`: `ring-store` no selecionado.
   - `ProductSubNav`: indicador deslizante `bg-store`; hover do link "Continuar comprando" `hover:text-store-ink`.
   - Dots do swipe mobile da galeria: `bg-store`.
3. **Focus**: `focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2` em todos os controles de compra (padrão já usado no `StoreButton`) — add, quantidade, swatches, tamanhos, subnav, favoritar, compartilhar, miniaturas.
4. **`Stars.tsx`**: `fill-amber-400` → `fill-nxw text-nxw` (token já existe no config).

Critério de aceite: loja com `brand_color` pinta toda a compra; loja sem `brand_color` cai no índigo default do `globals.css`.

## Fase 1 — Buy box (~3h)

1. **H1 display**: `font-integral uppercase text-[26px] sm:text-[30px] leading-[1.05]` (voz display do sistema; kicker de categoria vira eyebrow mono `text-store-ink`).
2. **Teaser em vez de descrição completa**: `line-clamp-2` + `border-l-2 border-store pl-3`; a descrição integral fica **só** na seção Descrição.
3. **Sem avaliações**: quando `totalReviews === 0`, não renderizar `<Stars>` — só o texto "Sem avaliações ainda".
4. **Novo `ProductFactsCard`** (assinatura da tela — "ficha do produto"):
   - Card `bg-nxsurf border rounded-xl` renderizando os `descriptiveFields` (dynamic_fields que não são cor/tamanho) como pares eyebrow-mono / valor, em grid 2 colunas com divisor.
   - Com isso os dynamic_fields **saem** de `ProductDescriptionSection` e `ProductSpecsSection` (ficam num lugar só — resolve a duplicação).
   - A escala visual (Slim→Regular→Oversized do comp) fica para uma iteração futura: exigiria metadado de "campo ordinal" no nicho; o MVP é o grid de fatos.
5. **Linha de pagamento** (substitui o "parcelamento" do comp): **não inventar parcelamento** — o pagamento é combinado no WhatsApp e a plataforma não pode prometer 6×/12× sem juros. Em vez disso, sob o preço: `Pix · Crédito · Boleto — combinado no WhatsApp`, derivado de `storeInfo.payment_methods` via `paymentMethodLabel()` (já existe em `lib/storefront.ts`). Se o lojista não tiver métodos configurados, omitir a linha.
6. **Novo `ProductTrustSeals`**: faixa de 2–3 selos com dados reais, sem promessa fabricada:
   - `free_delivery_min` → "Frete grátis acima de R$ X" (`freeShippingLabel()` já existe);
   - `whatsapp` → "Pagamento seguro no WhatsApp";
   - `city/state` → "Enviado de {cidade}/{UF}".
   Renderizar só os que existem; ocultar a faixa com menos de 2.
7. **Esgotado forte** no `ProductSizeSelector`: `line-through opacity-55` no rótulo + sub-label mono `esgotado` (como no comp), mantendo `disabled` + `aria-disabled`.
8. **Badge de desconto em UM lugar**: remover o badge da `ProductPricing` (fica só o preço riscado); o badge `-N%` vive só na galeria.

## Fase 2 — Galeria premium (~3h)

Refazer `ProductImageGallery` (desktop):

1. **Layout**: grid `[72px_1fr]` — rail vertical de miniaturas (borda `border-store` na ativa, `aria-current`) + stage único `aspect-[4/5]` com `object-contain` sobre `bg-nxsurf` (**nunca corta o produto**).
2. **Zoom no hover**: `group-hover:scale-[1.045]` com a assinatura de easing do sistema; hint "Ampliar" mono no canto.
3. **Lightbox**: usar o `Dialog` (Radix) já existente em `ui/` — imagem grande, navegação ← → e Esc, dots; foco restaurado ao fechar (o Radix já cumpre o contrato de modal).
4. **Mobile**: manter o swipe com snap + dots (dots em `bg-store`); toque abre o mesmo lightbox.
5. Manter `galleryKey`/`nx-gallery-swap` (motion de troca de cor) e `priority` na primeira imagem.

## Fase 3 — Barra de compra mobile (~1h30)

`ProductMobileBuyBar` ganha paridade com o desktop:

1. Mesmo verbo: **"Adicionar à sacola"** (hoje "Comprar").
2. Linha superior: resumo da variação em mono (`{cor} · Tam. {tamanho}` — só os eixos que o produto tem) + preço `tabular-nums`.
3. Stepper de quantidade (novas props `quantity/onIncrease/onDecrease` — já existem no hook `useProductDetailPage`).
4. `pb-[calc(12px+env(safe-area-inset-bottom))]` e `fixed` (hoje `sticky`).
5. Suprimir o `WhatsAppChatWidget` FAB enquanto a barra estiver visível **ou** usar a prop `liftedOnMobile` já criada na PLP.

## Fase 4 — Seções (~2h30)

1. **Cabeçalho de seção padrão**: eyebrow mono + H2 `font-integral uppercase` (reusar/estender `StoreSectionHeader` se o shape servir).
2. **`ProductDescriptionSection`**: só prosa (descrição integral); remover categoria repetida e dynamic_fields (foram para a `ProductFactsCard`).
3. **`ProductSpecsSection`**: tabela `dt` mono uppercase sobre `bg-nxsurf` / `dd` valor (como no comp); fonte de dados: `product.specifications` apenas.
4. **`ProductReviews`** (ajuste visual, sem mexer em dados): grid `[280px_1fr]` no desktop — resumo com **apenas** o que o `summary` traz (nota grande `tabular-nums` + `<Stars>` + "N avaliações") e lista de cards com avatar de iniciais em `bg-store/[0.08] text-store-ink`, nome, data e comentário (campos reais do `ProductReview`). Sem barras de distribuição, sem "% recomendam", sem chips de variação.
5. **`ProductQuestions`**: cards com marcadores P/R (P em `bg-nxi1`, R em `bg-store/[0.08] text-store-ink`) — restyle apenas, usando os campos que o hook já consome hoje.
6. **`RelatedProducts`**: título "Você também vai gostar" no padrão de seção; cards do kit (mesmo card da home/PLP).

## Fase 5 — QA (~1h30)

- `pnpm lint && pnpm exec tsc --noEmit && pnpm build`.
- Matriz de estados: produto **sem imagens** (EmptyImageState), **sem variações**, **variação 1 eixo só** (só cor ou só tamanho), **tamanho esgotado**, **estoque 0 total**, **sem reviews**, **sem perguntas**, **loja sem brand_color**, **loja sem payment_methods/free_delivery_min** (linha de pagamento e selos ocultos).
- Screenshots desktop 1280 e mobile 390 comparados com o comp; a11y: foco visível em todos os controles, alvos ≥44px, `aria-pressed`/`aria-current` corretos.

## Ordem e dependências

```
Fase 0 (accent) ──► Fase 1 (buy box) ──► Fase 3 (barra mobile)
                └─► Fase 2 (galeria)     └─► Fase 4 (seções) ──► Fase 5 (QA)
```

Total estimado: ~12h. Cada fase é um commit independente e a página continua funcional entre fases.

## Decisões registradas

- **Nada além da API** (regra no topo): o comp é referência visual; onde ele mostra dado que o backend não tem, o elemento é cortado — não mockado.
- **Sem parcelamento fabricado**: o comp mostrava "6× sem juros", mas o pagamento é negociado no WhatsApp — exibir parcelas seria promessa que o lojista pode não cumprir. Fica a linha de métodos de pagamento reais da loja.
- **Sem estimador de CEP** (pedido do Eduardo).
- **Escala ordinal na ficha** (Slim→Oversized) adiada: precisa de metadado de nicho no backend; MVP usa grid de fatos.
- **Fotos**: os SVGs do comp são placeholders — em produção entram as imagens reais do produto via `buildImageUrls`.
