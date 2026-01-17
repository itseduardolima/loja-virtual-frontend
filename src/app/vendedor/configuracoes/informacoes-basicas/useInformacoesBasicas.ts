import { useState, useEffect } from 'react'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'
import { useAllNiches } from '@/hooks/useNiches'

export function useInformacoesBasicas() {
  const { data: store, isLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()
  const { data: nichesData, isLoading: nichesLoading } = useAllNiches()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    niche_ids: [] as string[]
  })

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)

  useEffect(() => {
    if (store) {
      // Extrair nichos de store_niches
      const storeNiches = (store as any)?.store_niches || []
      const nicheIds = storeNiches.map((sn: any) => sn.niche_id.toString())

      setFormData({
        name: (store as any)?.name || '',
        description: (store as any)?.description || '',
        niche_ids: nicheIds
      })
      
      // Carregar previews das imagens existentes
      if ((store as any)?.logo) {
        setLogoPreview((store as any).logo)
      }
      if ((store as any)?.banner) {
        setBannerPreview((store as any).banner)
      }
    }
  }, [store])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (type: 'logo' | 'banner', file: File | null) => {
    if (file) {
      if (type === 'logo') {
        setLogoFile(file)
        const reader = new FileReader()
        reader.onload = (e) => setLogoPreview(e.target?.result as string)
        reader.readAsDataURL(file)
      } else {
        setBannerFile(file)
        const reader = new FileReader()
        reader.onload = (e) => setBannerPreview(e.target?.result as string)
        reader.readAsDataURL(file)
      }
    }
  }

  const handleNicheToggle = (nicheId: string) => {
    setFormData(prev => {
      const currentIds = prev.niche_ids || []
      const isSelected = currentIds.includes(nicheId)
      
      if (isSelected) {
        return { ...prev, niche_ids: currentIds.filter(id => id !== nicheId) }
      } else {
        return { ...prev, niche_ids: [...currentIds, nicheId] }
      }
    })
  }

  const handleSave = async () => {
    if (!store?.id) return
    
    try {
      const updateData: any = {
        name: formData.name,
        description: formData.description,
        niche_ids: formData.niche_ids
      }

      if (logoFile) {
        updateData.logo = logoFile
      }
      if (bannerFile) {
        updateData.banner = bannerFile
      }

      await updateStore({
        storeId: store.id,
        data: updateData
      })
    } catch (error) {
      console.error('Erro ao atualizar informações básicas:', error)
    }
  }

  return {
    store,
    isLoading,
    isUpdating,
    formData,
    logoFile,
    bannerFile,
    logoPreview,
    bannerPreview,
    nichesData,
    nichesLoading,
    handleInputChange,
    handleFileChange,
    handleNicheToggle,
    handleSave
  }
}

