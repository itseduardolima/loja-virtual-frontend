# SPEC — Padrões de Formulário

> Lei de construção de formulários no painel do vendedor.
> Complementa [`DESIGN_SPEC.md`](./DESIGN_SPEC.md) — tokens e tipografia definidos lá valem aqui.

**Fonte de verdade dos primitivos:** `src/app/vendedor/configuracoes/_shared.tsx`

---

## 1. Arquitetura em 3 camadas

Todo formulário é dividido em:

```
page.tsx          ← UI pura: renderiza campos, exibe erros, chama handlers
useXxx.ts         ← lógica: estado, validação em tempo real, submit
xxxSchemas.ts     ← regras Yup: separadas por contexto em src/schemas/
```

**Nunca misturar lógica de validação dentro do componente de página.** O hook é o único dono do estado e das regras.

---

## 2. Primitivos (`_shared.tsx`)

Importar sempre de `'../_shared'` ou configurar alias se usar de fora de `configuracoes/`.

### `SectionCard`

Container padrão de seção. Toda seção de formulário vive dentro de um `SectionCard`.

```tsx
<SectionCard>          // rounded-2xl border border-nxborder bg-white shadow-[0_1px_2px_hsl(0_0%_0%/0.04)] p-5 md:p-6
  ...
</SectionCard>

<SectionCard flush>    // sem padding interno — útil quando a seção tem preview visual no topo
  ...
</SectionCard>
```

### `SectionHeader`

Cabeçalho de seção. Sempre o primeiro filho do `SectionCard`.

```tsx
<SectionHeader
  title="Identidade textual"
  description="Como sua loja é encontrada nos buscadores."
/>
// title  → text-base font-bold tracking-[-0.01em] text-nxi1
// description → text-[13px] leading-[1.5] text-nxi2
```

### `FieldGrid`

Grid responsivo de campos. Padrão: 2 colunas em `md+`, 1 coluna em mobile.

```tsx
<FieldGrid columns={2}>   // grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5
<FieldGrid columns={1}>   // formulários simples / campos longos
<FieldGrid columns={3}>   // densidades maiores (raro)
```

### `Field`

Wrapper de um campo individual. Controla alinhamento vertical e `gap-1.5` entre label, input e help.

```tsx
<Field>           // flex flex-col gap-1.5
<Field full>      // md:col-span-full — ocupa toda a largura do grid
```

### `FieldLabel`

```tsx
<FieldLabel htmlFor="name">Nome da loja</FieldLabel>
// text-[12.5px] font-semibold tracking-[0.01em] text-nxi2

<FieldLabel htmlFor="name" required>Nome da loja</FieldLabel>
// adiciona <span className="text-nxa">*</span> ao final
```

### `FieldHelp`

Texto auxiliar abaixo do input. Quatro variantes:

```tsx
<FieldHelp>Aparece na vitrine e nos buscadores.</FieldHelp>
// variant="default" → text-[11.5px] text-nxi3

<FieldHelp variant="error">{errors.name}</FieldHelp>
// text-[11.5px] text-nxd font-semibold + ícone AlertCircle

<FieldHelp variant="ok">Slug disponível!</FieldHelp>
// text-[11.5px] text-nxs font-semibold + ícone Check

<FieldHelp variant="checking">Verificando…</FieldHelp>
// text-[11.5px] text-nxi3 + ícone Loader2 girando
```

**Padrão de exibição condicional:**
```tsx
{errors.name ? (
  <FieldHelp variant="error">{errors.name}</FieldHelp>
) : (
  <FieldHelp>{formData.name.length}/100 · aparece no cabeçalho da loja.</FieldHelp>
)}
```

### `nxInputClass(error?)`

Função que retorna as classes do `<Input>` / `<Textarea>`. **Nunca escrever classes de input manualmente.**

```tsx
<Input
  id="name"
  value={formData.name}
  onChange={(e) => handleInputChange('name', e.target.value)}
  className={nxInputClass(!!errors.name)}
/>
// nxInputClass(false) → h-10 rounded-lg border border-nxborder bg-white px-3 py-2 text-[13px]
//                        text-nxi1 focus-visible:outline-none focus-visible:ring-2
//                        focus-visible:ring-nxp/30 focus-visible:border-nxp
// nxInputClass(true)  → mesmas classes + border-nxd focus-visible:border-nxd
```

Para `<Textarea>`: aplicar as mesmas classes manualmente (sem `h-10`), adicionando `min-h-[Xpx]`:
```tsx
className={cn(
  'min-h-[90px] rounded-lg border bg-white px-3 py-2 text-[13px] text-nxi1',
  'placeholder:text-nxi3 focus-visible:outline-none focus-visible:ring-2',
  errors.description
    ? 'border-nxd focus-visible:ring-nxd/30 focus-visible:border-nxd'
    : 'border-nxborder focus-visible:ring-nxp/30 focus-visible:border-nxp',
)}
```

### `FormActions`

Rodapé fixo de ações. Sempre o último filho do `SectionCard`.

```tsx
<FormActions>
  // mt-6 flex flex-wrap items-center justify-end gap-2 border-t border-nxborder pt-4
  <NxButton variant="ghost" onClick={handleCancel}>Cancelar</NxButton>
  <NxButton loading={isUpdating} onClick={handleSave}>Salvar alterações</NxButton>
</FormActions>
```

### `NxButton`

```tsx
<NxButton variant="primary" onClick={handleSave} loading={isUpdating}>
  {isUpdating ? 'Salvando…' : 'Salvar alterações'}
</NxButton>

<NxButton variant="ghost">Cancelar</NxButton>
<NxButton variant="danger">Excluir conta</NxButton>
```

| Variante | Quando usar |
|---|---|
| `primary` | Ação principal da tela (1 por `FormActions`) |
| `ghost` | Ações secundárias, cancelar, voltar |
| `danger` | Ações destrutivas irreversíveis |

### `Switch`

```tsx
<Switch
  checked={formData.featured}
  onChange={(next) => handleInputChange('featured', next)}
  ariaLabel="Produto em destaque"
/>
// ativo: bg-nxp | inativo: bg-nxborder | slider: bg-white shadow
```

### `ToggleRow`

Campo com switch + conteúdo expansível. Usar para configurações on/off com sub-campos.

```tsx
<ToggleRow
  on={formData.freeDeliveryEnabled}
  onChange={(next) => handleInputChange('freeDeliveryEnabled', next)}
  title="Entrega grátis"
  desc="Defina o valor mínimo do pedido para isentar o frete."
  badge="Pro"         // opcional
>
  {/* Sub-campos visíveis apenas quando on=true */}
  <Field>
    <FieldLabel htmlFor="free_delivery_min">Valor mínimo</FieldLabel>
    <Input id="free_delivery_min" ... />
  </Field>
</ToggleRow>
```

### `Notice`

Banner informativo dentro do formulário. Não é toast — fica fixo na UI.

```tsx
<Notice variant="info">Alterações afetam a vitrine imediatamente.</Notice>
<Notice variant="amber">Nenhum nicho selecionado. Selecione na etapa 1.</Notice>
<Notice variant="error">Erro ao salvar. Tente novamente.</Notice>
```

---

## 3. Estrutura completa de uma página de formulário

```tsx
'use client'

import { useXxx } from './useXxx'
import { Input, LoadingSpinner } from '@/components'
import {
  SectionCard, SectionHeader,
  Field, FieldLabel, FieldHelp, FieldGrid,
  FormActions, NxButton, nxInputClass,
} from '../_shared'

export default function XxxPage() {
  const { isLoading, isUpdating, formData, errors, isFormValid, handleInputChange, handleSave } = useXxx()

  // Estado de carregamento
  if (isLoading) {
    return (
      <SectionCard>
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner size="md" />
        </div>
      </SectionCard>
    )
  }

  return (
    <SectionCard>
      <SectionHeader title="Título" description="Descrição curta." />

      <FieldGrid columns={2}>
        <Field full>
          <FieldLabel htmlFor="campo" required>Nome do campo</FieldLabel>
          <Input
            id="campo"
            value={formData.campo}
            onChange={(e) => handleInputChange('campo', e.target.value)}
            placeholder="Ex.: valor esperado"
            className={nxInputClass(!!errors.campo)}
          />
          {errors.campo ? (
            <FieldHelp variant="error">{errors.campo}</FieldHelp>
          ) : (
            <FieldHelp>Texto de ajuda contextual.</FieldHelp>
          )}
        </Field>
      </FieldGrid>

      <FormActions>
        <NxButton loading={isUpdating} disabled={!isFormValid} onClick={handleSave}>
          {isUpdating ? 'Salvando…' : 'Salvar alterações'}
        </NxButton>
      </FormActions>
    </SectionCard>
  )
}
```

---

## 4. Estrutura do hook customizado

```ts
// useXxx.ts
export function useXxx() {
  // 1. Dados remotos
  const { data: store, isLoading } = useStore()
  const { mutateAsync: updateStore, isPending: isUpdating } = useUpdateStore()

  // 2. Estado local
  const [formData, setFormData] = useState({ campo: '', outro: '' })
  const [errors, setErrors] = useState<{ campo?: string; outro?: string }>({})

  // 3. Carregar dados iniciais
  useEffect(() => {
    if (store) {
      setFormData({ campo: store.campo ?? '', outro: store.outro ?? '' })
    }
  }, [store])

  // 4. Validação em tempo real (por campo)
  const handleInputChange = async (field: string, value: string) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value }
      xxxSchema.validateAt(field, next, { abortEarly: false })
        .then(() => setErrors(e => ({ ...e, [field]: undefined })))
        .catch(err => {
          if (err instanceof yup.ValidationError) {
            const msg = err.inner.find(e => e.path === field)?.message ?? err.message
            setErrors(e => ({ ...e, [field]: msg }))
          }
        })
      return next
    })
  }

  // 5. Validação geral (controla disabled do botão)
  const isFormValid = useMemo(() => {
    if (Object.values(errors).some(Boolean)) return false
    try { xxxSchema.validateSync(formData, { abortEarly: false }); return true }
    catch { return false }
  }, [formData, errors])

  // 6. Submit
  const handleSave = async () => {
    try {
      await xxxSchema.validate(formData, { abortEarly: false })
      setErrors({})
      await updateStore({ storeId: store!.id, data: formData })
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errs: Record<string, string> = {}
        err.inner.forEach(e => { if (e.path) errs[e.path] = e.message })
        setErrors(errs)
      }
    }
  }

  return { isLoading, isUpdating, formData, errors, isFormValid, handleInputChange, handleSave }
}
```

### Ciclo de validação

| Momento | Método Yup | Propósito |
|---|---|---|
| `onChange` | `validateAt(field, data)` | Valida apenas o campo alterado (não bloqueia o usuário) |
| `useMemo` | `validateSync(data)` | Verifica se tudo é válido — controla `disabled` do botão |
| `handleSave` | `validate(data)` | Valida tudo antes de enviar; captura e exibe todos os erros |

---

## 5. Schemas Yup (`src/schemas/`)

Um arquivo por contexto. Convenção de nome: `[contexto]Schemas.ts`.

```ts
// src/schemas/xxxSchemas.ts
import * as yup from 'yup'

export const xxxSchema = yup.object({
  // Campo obrigatório
  name: yup.string()
    .required('Nome é obrigatório')
    .min(3, 'Mínimo 3 caracteres')
    .max(100, 'Máximo 100 caracteres'),

  // Campo opcional
  description: yup.string()
    .optional()
    .max(170, 'Máximo 170 caracteres'),

  // Número (evitar NaN de input vazio)
  delivery_fee: yup.number()
    .transform((val, orig) => (orig === '' || orig === null ? undefined : val))
    .optional()
    .min(0, 'Não pode ser negativo')
    .typeError('Deve ser um número'),

  // URL com teste customizado
  instagram: yup.string()
    .optional()
    .test('instagram-url', 'Link inválido. Use: https://instagram.com/usuario', val => {
      if (!val?.trim()) return true
      return /^(https?:\/\/)?(www\.)?instagram\.com\/.+$/i.test(val)
    }),

  // Telefone (aceita dígitos apenas)
  whatsapp: yup.string()
    .optional()
    .test('phone', 'Número inválido (8–15 dígitos)', val => {
      if (!val?.trim()) return true
      return /^\d{8,15}$/.test(val.replace(/\D/g, ''))
    }),
})

// Inferir tipo TypeScript do schema
export type XxxFormData = yup.InferType<typeof xxxSchema>
```

Arquivos existentes em `src/schemas/`:

| Arquivo | Contexto |
|---|---|
| `informacoesBasicasSchemas.ts` | Nome, descrição, logo, banner |
| `contatosSchemas.ts` | WhatsApp, e-mail, Instagram, Facebook |
| `enderecoSchemas.ts` | Endereço completo com CEP |
| `entregaSchemas.ts` | Taxa de entrega, valor mínimo, prazo |
| `horarioSchemas.ts` | Horário de funcionamento por dia |
| `documentosSchemas.ts` | CPF, CNPJ |
| `pagamentoSchemas.ts` | Métodos de pagamento |
| `productSchemas.ts` | Produto (nome, preço, variantes, campos dinâmicos) |
| `createStoreSchemas.ts` | Wizard criar loja (step1, step2, step3, completo) |
| `checkoutSchemas.ts` | Dados do cliente no checkout |
| `couponSchemas.ts` | Cupons de desconto da loja |
| `categorySchemas.ts` | Categorias da loja |
| `planCouponSchemas.ts` | Cupons de plano (admin) |
| `planSchemas.ts` | Planos (admin) |
| `customerProfileSchemas.ts` | Perfil do cliente |
| `nichosSchemas.ts` | Nichos e campos dinâmicos (admin) |

---

## 6. Componentes de input especializados

### `PhoneCountryInput`

Para qualquer campo de telefone/WhatsApp. Seletor de país + código DDI + input.

```tsx
import { PhoneCountryInput } from '@/components/Form/PhoneCountryInput'

<PhoneCountryInput
  id="whatsapp"
  value={formData.whatsapp}
  onValueChange={(val) => handleInputChange('whatsapp', val)}
  placeholder="(11) 99999-9999"
  selectedCountry={selectedCountry}               // string: 'BR', 'US', etc.
  onSelectedCountryChange={handleCountrySelect}
  countriesData={countriesData}                   // de useCountries()
  countriesLoading={countriesLoading}
  inputClassName={nxInputClass(!!errors.whatsapp)}
/>
```

Antes do submit, prefixar código do país manualmente:
```ts
const clean = formData.whatsapp.replace(/\D/g, '')
const withCode = clean ? `+${callingCode}${clean}` : ''
```

### `DynamicFields`

Para campos de nicho de produto. Ver [`SPEC_niches-campos.md`](./SPEC_niches-campos.md).

```tsx
import DynamicFields from '@/components/Form/DynamicFields'

<DynamicFields
  nicheId={selectedNicheId}
  fields={nicheFields}
  values={dynamicFieldValues}
  onFieldChange={(fieldId, value) => handleDynamicFieldChange(fieldId, value)}
/>
```

### `ImageUpload` / `ImageUploadByColor`

Upload simples e upload agrupado por cor. Ver [`SPEC_produto-crud.md`](./SPEC_produto-crud.md).

---

## 7. Upload de arquivo com crop

Padrão usado para logo e banner da loja:

```tsx
// 1. Input oculto dispara seleção
<input
  type="file"
  id="logo-upload"
  accept="image/*"
  className="sr-only"
  onChange={(e) => handleFileSelect('logo', e.target.files?.[0] ?? null)}
/>

// 2. Preview clicável como label
<label htmlFor="logo-upload" className="group relative cursor-pointer ...">
  {logoPreview ? <Image src={logoPreview} /> : <div>{initials}</div>}
</label>
```

No hook:
```ts
// Lê o arquivo e abre o dialog de crop
const handleFileSelect = (type: 'logo' | 'banner', file: File | null) => {
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) =>
    setCropTarget({ type, imageSrc: e.target?.result as string, fileName: file.name })
  reader.readAsDataURL(file)
}

// Recebe o arquivo croppado do dialog
const handleCropDone = (type: 'logo' | 'banner', croppedFile: File, previewUrl: string) => {
  if (type === 'logo') { setLogoFile(croppedFile); setLogoPreview(previewUrl) }
  else { setBannerFile(croppedFile); setBannerPreview(previewUrl) }
  setCropTarget(null)
}

// No submit: inclui arquivo no FormData
if (logoFile) updateData.logo = logoFile
if (bannerFile) updateData.banner = bannerFile
```

---

## 8. Formulários multi-step (wizard)

Usado em: criar loja (`/vendedor/criar-loja`), criar produto (`/vendedor/produtos/criar`).

### Validação por step

```ts
// Schemas separados por step
export const createStoreStep1Schema = yup.object({ name: ..., description: ... })
export const createStoreStep2Schema = yup.object({ niche_ids: ... })
export const createStoreStep3Schema = yup.object({ whatsapp: ..., email: ... })
export const createStoreSchema = createStoreStep1Schema
  .concat(createStoreStep2Schema)
  .concat(createStoreStep3Schema)

// Ao clicar "Próximo"
const advanceStep = async () => {
  const stepSchema = [step1Schema, step2Schema, step3Schema][currentStep - 1]
  try {
    await stepSchema.validate(formData, { abortEarly: false })
    setCurrentStep(s => s + 1)
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errs: Record<string, string> = {}
      err.inner.forEach(e => { if (e.path) errs[e.path] = e.message })
      setErrors(errs)
    }
  }
}

// Submit final: validar schema completo
await createStoreSchema.validate(formData, { abortEarly: false })
```

### Componente de navegação (`ProductSteps.tsx`)

```tsx
<ProductSteps currentStep={step} totalSteps={4} onStepClick={goToStep} />
// Etapas anteriores: clicáveis
// Etapa atual: destaque nxp
// Etapas futuras: cinza nxi3, não clicáveis
```

---

## 9. Estados do formulário — checklist

| Estado | O que fazer |
|---|---|
| Carregando dados | `<LoadingSpinner size="md">` centralizado dentro do `SectionCard` |
| Campo com erro | `nxInputClass(true)` + `<FieldHelp variant="error">` |
| Campo válido após edição | `nxInputClass(false)` + `<FieldHelp>` com texto de ajuda |
| Verificação assíncrona (slug, e-mail) | `<FieldHelp variant="checking">Verificando…` |
| Confirmação assíncrona (slug livre) | `<FieldHelp variant="ok">Disponível!` |
| Salvando | `<NxButton loading={true}>Salvando…` + campos não bloqueados |
| Botão principal desabilitado | `disabled={!isFormValid}` — nunca `disabled={isUpdating}` sozinho |
| Erro de API após submit | `<Notice variant="error">` acima do `<FormActions>` |
| Aviso contextual | `<Notice variant="amber">` imediatamente antes dos campos afetados |

---

## 10. O que NÃO fazer

- ❌ Escrever classes de input manualmente — usar `nxInputClass(error)`
- ❌ Colocar validação Yup diretamente no componente de página
- ❌ Criar novo schema inline — adicionar em `src/schemas/[contexto]Schemas.ts`
- ❌ Usar `React Hook Form` para formulários de configuração — o padrão do projeto é `useState` + Yup direto
- ❌ Mostrar erros de validação antes do usuário tocar o campo
- ❌ `disabled={isUpdating}` como única condição do botão — o botão deve ficar habilitado assim que o formulário é válido, mesmo que um save anterior tenha falhado
- ❌ Usar `<input type="file">` visível — sempre ocultar com `sr-only` e usar um `<label>` clicável como trigger
- ❌ Criar campo de telefone sem `PhoneCountryInput`
