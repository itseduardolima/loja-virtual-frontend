import { useState, useEffect, useMemo } from 'react'
import isEqual from 'lodash/isEqual'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'
import { heroContent, announcementText } from '@/lib/storefront'
import { buildImageUrl } from '@/lib/imageUtils'
import type { StoreInfo } from '@/types/store'

export interface VitrineFormData {
  hero_eyebrow: string
  hero_title: string
  hero_subtitle: string
  announcement_text: string
  campaign_title: string
  campaign_text: string
}

const LIMITS: Record<keyof VitrineFormData, number> = {
  hero_eyebrow: 60,
  hero_title: 120,
  hero_subtitle: 300,
  announcement_text: 160,
  campaign_title: 120,
  campaign_text: 300,
}

const initial: VitrineFormData = {
  hero_eyebrow: '',
  hero_title: '',
  hero_subtitle: '',
  announcement_text: '',
  campaign_title: '',
  campaign_text: '',
}

export function useVitrine() {
  const { data: store, isLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()

  const [formData, setFormData] = useState<VitrineFormData>(initial)
  const [server, setServer] = useState<VitrineFormData>(initial)

  // campaign image: arquivo após crop + URL de preview (blob ou URL do backend)
  const [campaignImageFile, setCampaignImageFile] = useState<File | null>(null)
  const [campaignImagePreview, setCampaignImagePreview] = useState<string | null>(null)
  // true quando o usuário removeu explicitamente a imagem existente (sem substituir)
  const [campaignImageRemoved, setCampaignImageRemoved] = useState(false)

  // crop dialog state — null = fechado
  const [cropTarget, setCropTarget] = useState<{ imageSrc: string; fileName: string } | null>(null)

  useEffect(() => {
    if (!store) return
    const s = store as StoreInfo
    const next: VitrineFormData = {
      hero_eyebrow: s.hero_eyebrow ?? '',
      hero_title: s.hero_title ?? '',
      hero_subtitle: s.hero_subtitle ?? '',
      announcement_text: s.announcement_text ?? '',
      campaign_title: s.campaign_title ?? '',
      campaign_text: s.campaign_text ?? '',
    }
    setFormData(next)
    setServer(next)
    // preview inicial: URL do backend (se existir)
    setCampaignImagePreview(s.campaign_image ? buildImageUrl(s.campaign_image) : null)
  }, [store])

  /** Abre o dialog de crop ao selecionar um arquivo. */
  const handleCampaignImageSelect = (file: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) =>
      setCropTarget({ imageSrc: e.target?.result as string, fileName: file.name })
    reader.readAsDataURL(file)
  }

  /** Chamado pelo ImageCropDialog ao confirmar o recorte. */
  const handleCropDone = (croppedFile: File, previewUrl: string) => {
    setCampaignImageFile(croppedFile)
    setCampaignImagePreview(previewUrl)
    setCropTarget(null)
  }

  /** Remove a imagem da campanha (volta ao estado sem imagem). */
  const handleRemoveCampaignImage = () => {
    setCampaignImageFile(null)
    setCampaignImagePreview(null)
    setCampaignImageRemoved(true)
  }

  const isDirty = useMemo(
    () => !isEqual(formData, server) || campaignImageFile !== null || campaignImageRemoved,
    [formData, server, campaignImageFile, campaignImageRemoved],
  )

  const errors = useMemo(() => {
    const errs: Partial<Record<keyof VitrineFormData, string>> = {}
    for (const key of Object.keys(LIMITS) as Array<keyof VitrineFormData>) {
      if (formData[key].length > LIMITS[key]) {
        errs[key] = `Máximo de ${LIMITS[key]} caracteres.`
      }
    }
    return errs
  }, [formData])

  const isFormValid = Object.keys(errors).length === 0

  const setField = (key: keyof VitrineFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    if (!store?.id || !isFormValid) return
    try {
      await updateStore({
        storeId: store.id,
        data: {
          hero_eyebrow: formData.hero_eyebrow.trim(),
          hero_title: formData.hero_title.trim(),
          hero_subtitle: formData.hero_subtitle.trim(),
          announcement_text: formData.announcement_text.trim(),
          campaign_title: formData.campaign_title.trim(),
          campaign_text: formData.campaign_text.trim(),
          ...(campaignImageFile
            ? { campaign_image: campaignImageFile }
            : campaignImageRemoved
              ? { remove_campaign_image: true }
              : {}),
        },
      })
      setServer(formData)
      setCampaignImageFile(null)
      setCampaignImageRemoved(false)
    } catch (err) {
      console.error('Erro ao salvar vitrine:', err)
    }
  }

  const handleReset = () => {
    setFormData(server)
    setCampaignImageFile(null)
    setCampaignImageRemoved(false)
    const s = store as StoreInfo | undefined
    setCampaignImagePreview(s?.campaign_image ? buildImageUrl(s.campaign_image) : null)
  }

  // StoreInfo mesclado com formData — alimenta a pré-visualização em tempo real
  const previewStore = useMemo<StoreInfo | null>(() => {
    if (!store) return null
    return {
      ...(store as StoreInfo),
      hero_eyebrow: formData.hero_eyebrow,
      hero_title: formData.hero_title,
      hero_subtitle: formData.hero_subtitle,
      announcement_text: formData.announcement_text,
      campaign_title: formData.campaign_title,
      campaign_text: formData.campaign_text,
      campaign_image: campaignImagePreview ?? (store as StoreInfo).campaign_image,
    }
  }, [store, formData, campaignImagePreview])

  // Placeholders mostrando o padrão derivado dos dados da loja
  const defaults = useMemo(() => {
    const s = store as StoreInfo | undefined
    const hero = heroContent(s)
    return {
      hero_eyebrow: hero.eyebrow,
      hero_title: hero.title,
      hero_subtitle: hero.subtitle ?? 'Descrição da loja (configure em Informações básicas)',
      announcement_text:
        (s?.announcement_text ? announcementText({ ...s, announcement_text: '' }) : announcementText(s)) ??
        'Sem frete grátis configurado — a barra fica oculta',
    }
  }, [store])

  return {
    isLoading,
    isUpdating,
    formData,
    errors,
    isDirty,
    isFormValid,
    setField,
    handleSave,
    handleReset,
    defaults,
    limits: LIMITS,
    previewStore,
    campaignImagePreview,
    cropTarget,
    setCropTarget,
    handleCampaignImageSelect,
    handleCropDone,
    handleRemoveCampaignImage,
  }
}
