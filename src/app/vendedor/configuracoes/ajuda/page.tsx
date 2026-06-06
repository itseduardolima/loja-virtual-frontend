'use client'

import { cn } from '@/lib/utils'
import { LoadingSpinner } from '@/components'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { Input } from '@/components/ui/input'
import {
  SectionCard,
  SectionHeader,
  Field,
  FieldLabel,
  FieldHelp,
  ToggleRow,
  Notice,
  FormActions,
  NxButton,
} from '../_shared'
import { useAjuda, PAGE_ITEMS } from './useAjuda'

type PageKey = typeof PAGE_ITEMS[number]['key']

export default function AjudaPage() {
  const {
    isLoading,
    isUpdating,
    activeTab,
    setActiveTab,
    formData,
    setField,
    errors,
    isDirty,
    isDirtyFor,
    handleSaveAll,
    handleResetAll,
  } = useAjuda()

  if (isLoading) {
    return (
      <SectionCard>
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner size="md" />
        </div>
      </SectionCard>
    )
  }

  const tab = formData[activeTab]
  const tabError = errors[activeTab]

  return (
    <div className="flex flex-col gap-4">
      <Notice variant="info">
        Configure as páginas informativas da sua loja. Apenas páginas ativadas aparecem no rodapé
        como links para os clientes.
      </Notice>

      {/* Tab bar */}
      <div className="flex flex-wrap gap-1.5">
        {PAGE_ITEMS.map((item) => {
          const active = activeTab === item.key
          const dirty = isDirtyFor(item.key as PageKey)
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveTab(item.key as PageKey)}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors',
                active
                  ? 'bg-nxp text-white'
                  : 'border border-nxborder bg-white text-nxi2 hover:border-nxp/50 hover:text-nxp',
              )}
            >
              {item.label}
              {dirty && (
                <span className="h-1.5 w-1.5 rounded-full bg-nxa" title="Alterações não salvas" />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <SectionCard flush>
        <ToggleRow
          title="Exibir no rodapé"
          desc="Quando ativo, o link aparece na coluna Ajuda do footer da loja."
          on={tab.enabled}
          onChange={(next) => setField(activeTab, 'enabled', next)}
        />
        <div className="p-5 md:p-6">
          <SectionHeader
            title={PAGE_ITEMS.find((p) => p.key === activeTab)?.label ?? ''}
            description="Edite o título e o conteúdo que serão exibidos na página pública da loja."
          />

          <div className="flex flex-col gap-5">
            <Field full>
              <FieldLabel required>Título da página</FieldLabel>
              <Input
                value={tab.title}
                onChange={(e) => setField(activeTab, 'title', e.target.value)}
                placeholder="Ex: Política de Trocas e Devoluções"
                maxLength={120}
                className={cn(tabError && 'border-nxd')}
              />
              {tabError && <FieldHelp variant="error">{tabError}</FieldHelp>}
            </Field>

            <Field full>
              <FieldLabel>Conteúdo</FieldLabel>
              <RichTextEditor
                content={tab.content}
                onChange={(html) => setField(activeTab, 'content', html)}
                placeholder="Descreva as informações desta página..."
              />
            </Field>
          </div>
        </div>
      </SectionCard>

      {isDirty && (
        <FormActions>
          <NxButton variant="ghost" onClick={handleResetAll} disabled={isUpdating}>
            Descartar alterações
          </NxButton>
          <NxButton
            variant="primary"
            onClick={handleSaveAll}
            loading={isUpdating}
            disabled={isUpdating}
          >
            Salvar alterações
          </NxButton>
        </FormActions>
      )}
    </div>
  )
}
