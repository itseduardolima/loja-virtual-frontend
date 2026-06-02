# Nexo — Specs

Documentação de design e features do projeto. Leia antes de implementar qualquer tela nova.

## Como usar

Ao pedir ao Claude Code para implementar uma feature, inclua o arquivo de spec relevante no contexto:
> "Implemente conforme `.specs/SPEC_produto-crud.md`"

Ao criar uma feature nova que ainda não tem spec, crie o arquivo aqui antes de implementar.

---

## Índice

| Arquivo | Conteúdo |
|---|---|
| [`DESIGN_SPEC.md`](./DESIGN_SPEC.md) | **Leia primeiro.** Tokens de cor, tipografia, espaçamento, componentes, padrões de página — a lei de design do sistema |
| [`SPEC_formularios.md`](./SPEC_formularios.md) | Primitivos de formulário (`_shared.tsx`), hook customizado, validação Yup em 3 momentos, upload com crop, wizard multi-step, estados visuais |
| [`SPEC_produto-crud.md`](./SPEC_produto-crud.md) | Wizard de criação/edição de produto, listagem, campos dinâmicos, variantes, imagens por cor |
| [`SPEC_pedidos.md`](./SPEC_pedidos.md) | Listagem de pedidos, drawer de detalhe, status, WhatsApp, exportação Excel, notificações real-time |
| [`SPEC_niches-campos.md`](./SPEC_niches-campos.md) | Sistema de nichos e campos dinâmicos — schema, 15 nichos ativos, `variant_dimension`, como adicionar nicho |
| [`SPEC_loja-publica.md`](./SPEC_loja-publica.md) | Vitrine pública — home, listagem com filtros, detalhe do produto, carrinho, checkout, rastreamento |
| [`SPEC_admin.md`](./SPEC_admin.md) | Painel administrativo — usuários, lojas, planos, assinaturas, estornos, permissões |
| [`SPEC_assinatura-onboarding.md`](./SPEC_assinatura-onboarding.md) | Fluxo completo: landing → escolha de plano → pagamento Asaas → criação da loja → primeiro produto |

---

## Regras

1. **`DESIGN_SPEC.md` é a fonte de verdade de design** — qualquer padrão novo deve ser adicionado lá antes de ser usado.
2. **Specs descrevem comportamento e estrutura** — não são código, não têm lógica de negócio detalhada.
3. **Sempre referenciar arquivos reais do codebase** — não descrever abstrações genéricas.
4. **Spec nova antes de feature nova** — se não existe spec, crie antes de implementar.
