# SPEC — Nichos e Campos Dinâmicos

> Documentação do sistema já implementado. Serve como referência para manutenção, expansão de nichos e construção de novas telas que consumam campos dinâmicos.

---

## Visão geral

O sistema de nichos define **o que um produto é** (Roupas, Eletrônicos, Pet Shop…) e determina quais **campos adicionais** o vendedor preenche ao cadastrá-lo. Esses campos alimentam filtros na vitrine e especificações no detalhe do produto.

---

## Modelo de dados

```
NICHE (1) ──── (N) NICHE_FIELD
  │                     │
  │                     └── PRODUCT_FIELD (valor por produto)
  │
STORE_NICHE (loja associada a 1+ nichos, um primário)
```

### NICHE
```prisma
model NICHE {
  id          Int
  name        String       // "Pet Shop"
  slug        String       // "pet-shop" — ASCII kebab-case, @unique
  description String?
  icon        String?      // IGNORADO no front — usar map slug → lucide
  color       String?      // hex #RRGGBB — usado em badges de nicho
  status      Int          // 1 = ativo
  sort_order  Int
}
```

### NICHE_FIELD
```prisma
model NICHE_FIELD {
  id                Int
  name              String       // "Voltagem"
  slug              String       // "voltagem" — snake_case para compostos
  field_type        String       // text | textarea | number | select | radio | color
  variant_dimension String?      // 'color' | 'size' | null
  options           String?      // JSON array ["110V","220V","Bivolt"] ou null
  required          Int          // 0 | 1 (TinyInt)
  sort_order        Int
  status            Int          // 1 = ativo
  niche_id          Int
}
```

### PRODUCT_FIELD
```prisma
model PRODUCT_FIELD {
  product_id    Int
  niche_field_id Int
  value         String   // sempre string — arrays são "A, B, C" separado por vírgula
}
```

---

## `field_type` — tipos canônicos

| Tipo | Valor armazenado | UX no formulário | UX na vitrine |
|---|---|---|---|
| `text` | string livre | `<input>` | Texto simples |
| `textarea` | string longa | `<textarea>` | Texto com quebra |
| `number` | número como string | `<input type="number">` | Valor numérico |
| `select` | "A, B, C" (multi) | Checkboxes (array) | Faceta multi-select |
| `radio` | "A" (único) | Pills de escolha única | Faceta single |
| `color` | "Preto, Azul" | Grid de bolinhas `COLOR_OPTIONS` | Swatches coloridos |

**Regra do DTO (backend):** `@IsIn(['text','textarea','number','select','radio','color'])` em `create-niche-field.dto.ts` — rejeita qualquer outro valor.

---

## `variant_dimension` — campos de variante vs. spec

Campos com `variant_dimension !== null` são **dimensões de variante** — alimentam `PRODUCT.colors`/`sizes` e `PRODUCT_STOCK`, não apenas `PRODUCT_FIELD`.

| `variant_dimension` | Campos com esse valor |
|---|---|
| `'color'` | Todos os campos `field_type = 'color'` |
| `'size'` | Campos com slug `tamanho` ou `numeracao` |
| `null` | Todos os outros — especificação pura |

**Impacto:**
- Na criação/edição do produto: `availableColors` e `availableSizes` derivam desses campos para montar o estoque por variante e o `ImageUploadByColor`.
- Na vitrine (`StoreSidebar`): campos com `variant_dimension !== null` são excluídos dos filtros de spec (evita duplicata com o filtro nativo de cor/tamanho).
- No backend (`products.service.ts`): `resolveVariantDimensions()` roteia os valores para `PRODUCT.colors`/`sizes` além de salvar em `PRODUCT_FIELD`.

---

## Nichos ativos (seed atual)

15 nichos, slug ASCII kebab-case, `sort_order` 1–15:

| # | Nome | Slug |
|---|---|---|
| 1 | Roupas | `roupas` |
| 2 | Sapatos e Calçados | `sapatos-calcados` |
| 3 | Acessórios de Moda | `acessorios` |
| 4 | Cosméticos e Beleza | `cosmeticos-beleza` |
| 5 | Eletrônicos | `eletronicos` |
| 6 | Casa e Decoração | `casa-decoracao` |
| 7 | Esportes e Fitness | `esportes-fitness` |
| 8 | Livros e Papelaria | `livros-papelaria` |
| 9 | Brinquedos e Infantil | `brinquedos-infantil` |
| 10 | Alimentos e Bebidas | `alimentacao` |
| 11 | Pet Shop | `pet-shop` |
| 12 | Saúde e Suplementos | `saude-suplementos` |
| 13 | Joias e Semijoias | `joias-semijoias` |
| 14 | Bebês e Maternidade | `bebes-maternidade` |
| 15 | Automotivo | `automotivo` |

---

## Campos por nicho — resumo

| Nicho | Campos obrigatórios | Campos opcionais relevantes |
|---|---|---|
| Roupas | Gênero (radio) | Cor*, Tamanho*, Público (radio), Material |
| Sapatos | — | Cor*, Numeração*, Gênero (radio), Material, Tipo de Sola |
| Acessórios | — | Cor*, Tipo de Acessório (radio), Material |
| Cosméticos | Tipo de Produto (radio) | Volume (number ml), Tom (radio), Tipo de Pele, Validade |
| Eletrônicos | Marca, Modelo | Cor*, Voltagem (radio), Condição (radio), Garantia (number) |
| Casa e Decoração | — | Cor*, Material, Dimensões, Ambiente |
| Esportes | Modalidade | Cor*, Tamanho*, Gênero (radio) |
| Livros e Papelaria | — | Autor, Editora, ISBN, Idioma (radio), Páginas (number), Encadernação (radio) |
| Brinquedos | Faixa Etária | Tipo, Material, INMETRO, Segurança (textarea) |
| Alimentos e Bebidas | — | Peso (number g), Tipo, Validade, Restrições, Ingredientes (textarea) |
| Pet Shop | Espécie (radio) | Tipo de Produto (radio), Porte, Peso (number kg), Sabor |
| Saúde e Suplementos | — | Tipo de Produto (radio), Sabor, Peso (number g), Porções (number) |
| Joias e Semijoias | Tipo de Peça (radio) | Material, Tipo de Banho, Pedra, Gênero (radio) |
| Bebês e Maternidade | Faixa Etária | Tipo de Produto (radio), Cor*, Material, INMETRO |
| Automotivo | — | Tipo de Produto (radio), Montadora, Modelo do Veículo, Ano (number) |

*campos com `variant_dimension`

---

## Regras de slug

| Entidade | Convenção | Exemplo |
|---|---|---|
| NICHE.slug | kebab-case ASCII | `pet-shop` |
| NICHE_FIELD.slug | snake_case para compostos, palavra única para simples | `tipo_peca`, `volume` |

**NUNCA** usar acentos em slugs — o `upsert` tem chave no slug e caracteres não-ASCII criam linhas duplicadas em banco.

**Renomear um slug em banco populado requer migration `UPDATE` in-place**, não re-seed:
```sql
UPDATE [niches] SET [slug] = 'novo-slug' WHERE [slug] = 'slug-antigo';
```

---

## Validação de campos obrigatórios (backend)

`products.service.ts` → `validateRequiredNicheFields(nicheId, dynamicFields)`:

1. Recebe o `niche_id` enviado pelo front (sempre mandado mesmo sem valores).
2. Busca todos os `NICHE_FIELD` com `required = 1` do nicho.
3. Rejeita com `BadRequestException` se algum campo obrigatório estiver ausente ou vazio.
4. **Não** é bypassável enviando zero campos — `niche_id` no payload garante a verificação.

---

## Endpoints

| Endpoint | Auth | Descrição |
|---|---|---|
| `GET /niches` | público | Lista todos os nichos ativos |
| `GET /niches/store/:storeId` | público | Nichos de uma loja |
| `GET /niches/fields/store/:storeId` | público | Todos os campos dos nichos da loja |
| `GET /niches/fields/niche/:nicheId` | público | Campos de um nicho específico |
| `GET /niches/fields/:id` | autenticado | Campo por ID |

---

## Hooks (frontend)

```ts
// src/hooks/useNiches.ts (ou similar)
useNiches()                      // lista todos os nichos
useNichesByStore(storeId)        // nichos da loja
useNicheFields(nicheId)          // campos do nicho selecionado
useNicheFieldsByStore(storeId)   // todos os campos da loja (vitrine)
```

---

## Como adicionar um novo nicho

1. Adicionar entrada em `seedNiches()` no `prisma/seed.ts` — slug ASCII kebab-case, sem acento.
2. Adicionar grupo de campos em `seedNicheFields()`.
3. Usar `field_type: 'radio'` para campos de escolha única.
4. Campos `color` e slugs `tamanho`/`numeracao` recebem `variant_dimension` automaticamente no loop de upsert.
5. **Em banco existente**: rodar `pnpm run prisma:seed` (upsert é idempotente pela chave `niche_id+slug`).

---

## Componente `DynamicFields`

Arquivo: `src/components/Form/DynamicFields.tsx`

Props:
```ts
{
  nicheId: number | null
  fieldValues: Record<string, NicheFieldValue>  // keyed por field.id.toString()
  onFieldChange: (fieldId: number, value: string | string[]) => void
}
```

- Carrega os campos via `useNicheFields(nicheId)`.
- Ordena: campo `color` vem primeiro (span 2 colunas), depois por `sort_order`.
- Campo `radio` → valor string; `select` → valor array; demais → string.
- Tipo desconhecido → fallback texto + `console.warn`.

---

## Paleta de cores (`COLOR_OPTIONS`)

Definida em `src/schemas/productSchemas.ts`.  
~60 cores em Title Case com hex mapeado via `getColorHex(name)`.

**Regra:** opções de campos `color` devem usar exatamente os nomes da `COLOR_OPTIONS`. Nomes fora da paleta caem no fallback cinza `#6B7280`. O seed define `options: null` para campos color — o front usa a paleta completa automaticamente.

---

## Armadilhas conhecidas

| Situação | Problema | Solução |
|---|---|---|
| Renomear slug de nicho | Cria linha nova, orfaniza STORE_NICHE | `UPDATE` in-place + re-seed |
| Cor fora de `COLOR_OPTIONS` | Swatch cinza genérico | Usar nome exato da paleta |
| `field_type = 'size'` | Era tipo morto (sem case no render) | Removido do DTO — usar `select` |
| `select` para atributo único | Usuário pode marcar múltiplos valores | Usar `radio` nesses casos |
| Campo `Numeração` não virava variante | Matcher só casava `tamanho` | Corrigido via `variant_dimension = 'size'` |
