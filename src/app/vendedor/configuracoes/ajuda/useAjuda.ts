'use client'

import { useState, useEffect, useCallback } from 'react'
import { useStorePages, useUpsertStorePage } from '@/hooks/useStorePages'
import { sanitizeHtml } from '@/lib/sanitize'

export const PAGE_ITEMS = [
  { key: 'returns', label: 'Trocas e devoluções' },
  { key: 'shipping', label: 'Envio e prazos' },
  { key: 'faq', label: 'Perguntas frequentes' },
  { key: 'about', label: 'Sobre a loja' },
  { key: 'privacy', label: 'Política de privacidade' },
] as const

type PageKey = typeof PAGE_ITEMS[number]['key']

interface PageState {
  title: string
  content: string
  enabled: boolean
}

type PagesState = Record<PageKey, PageState>

const EMPTY_PAGE: PageState = { title: '', content: '', enabled: false }

function buildEmptyState(): PagesState {
  return Object.fromEntries(PAGE_ITEMS.map((p) => [p.key, { ...EMPTY_PAGE }])) as PagesState
}

export function useAjuda() {
  const { data: serverPages, isLoading } = useStorePages()
  const { mutateAsync: upsert, isPending: isUpdating } = useUpsertStorePage()

  const [activeTab, setActiveTab] = useState<PageKey>(PAGE_ITEMS[0].key)
  const [formData, setFormData] = useState<PagesState>(buildEmptyState)
  const [server, setServer] = useState<PagesState>(buildEmptyState)
  const [errors, setErrors] = useState<Partial<Record<PageKey, string>>>({})

  // Sync server data into local state
  useEffect(() => {
    if (!serverPages) return
    const next = buildEmptyState()
    for (const page of serverPages) {
      const key = page.page_type as PageKey
      if (key in next) {
        next[key] = { title: page.title ?? '', content: page.content ?? '', enabled: page.enabled }
      }
    }
    setFormData(next)
    setServer(next)
  }, [serverPages])

  const isDirtyFor = useCallback(
    (key: PageKey) => JSON.stringify(formData[key]) !== JSON.stringify(server[key]),
    [formData, server],
  )

  const isDirty = PAGE_ITEMS.some((p) => isDirtyFor(p.key))

  const setField = useCallback(<K extends keyof PageState>(key: PageKey, field: K, value: PageState[K]) => {
    setFormData((prev) => {
      const current = prev[key]
      const updated = { ...current, [field]: value }
      // Auto-ativa quando título é preenchido pela primeira vez numa página desativada
      if (field === 'title' && !current.enabled && !current.title.trim() && (value as string).trim()) {
        updated.enabled = true
      }
      return { ...prev, [key]: updated }
    })
    if (field === 'title') {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }, [])

  const validateTab = (key: PageKey): boolean => {
    const { title } = formData[key]
    if (!title.trim()) {
      setErrors((prev) => ({ ...prev, [key]: 'Título obrigatório' }))
      return false
    }
    return true
  }

  const handleSaveAll = useCallback(async () => {
    const dirtyKeys = PAGE_ITEMS.map((p) => p.key as PageKey).filter((k) => isDirtyFor(k))

    // Valida todas as tabs sujas antes de enviar qualquer request
    let valid = true
    for (const key of dirtyKeys) {
      if (!validateTab(key)) {
        setActiveTab(key) // abre a tab com erro
        valid = false
        break
      }
    }
    if (!valid) return

    await Promise.all(
      dirtyKeys.map(async (key) => {
        const { title, content, enabled } = formData[key]
        const saved = { title: title.trim(), content: sanitizeHtml(content), enabled }
        await upsert({ type: key, data: saved })
        const next = { ...formData[key], ...saved }
        setFormData((prev) => ({ ...prev, [key]: next }))
        setServer((prev) => ({ ...prev, [key]: next }))
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, isDirtyFor, upsert])

  const handleResetAll = useCallback(() => {
    setFormData(server)
    setErrors({})
  }, [server])

  return {
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
  }
}
