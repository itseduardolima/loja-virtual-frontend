import { useState, useEffect, useMemo } from 'react'
import * as yup from 'yup'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'
import { useAllNiches } from '@/hooks/useNiches'
import { updateInformacoesBasicasSchema } from '@/schemas'

export function useInformacoesBasicas() {
  const { data: store, isLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()
  const { data: nichesData, isLoading: nichesLoading } = useAllNiches()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    niche_ids: [] as string[]
  })

  const [errors, setErrors] = useState<{
    name?: string
    description?: string
    niche_ids?: string
  }>({})

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

  const handleInputChange = async (field: string, value: string) => {
    setFormData(prev => {
      const updatedData = { ...prev, [field]: value }
      
      updateInformacoesBasicasSchema.validateAt(field, updatedData, { abortEarly: false })
        .then(() => {
          setErrors(prevErrors => ({ ...prevErrors, [field]: undefined }))
        })
        .catch((error) => {
          if (error instanceof yup.ValidationError) {
            // Pegar a mensagem específica do campo, não a genérica
            const fieldError = error.inner.find(err => err.path === field)
            const errorMessage = fieldError?.message || error.message
            setErrors(prevErrors => ({ ...prevErrors, [field]: errorMessage }))
          }
        })
      
      return updatedData
    })
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
      const updatedIds = isSelected
        ? currentIds.filter(id => id !== nicheId)
        : [...currentIds, nicheId]
      
      const updatedData = { ...prev, niche_ids: updatedIds }
      
      updateInformacoesBasicasSchema.validateAt('niche_ids', updatedData, { abortEarly: false })
        .then(() => {
          setErrors(prevErrors => ({ ...prevErrors, niche_ids: undefined }))
        })
        .catch((error) => {
          if (error instanceof yup.ValidationError) {
            // Pegar a mensagem específica do campo, não a genérica
            const fieldError = error.inner.find(err => err.path === 'niche_ids')
            const errorMessage = fieldError?.message || error.message
            setErrors(prevErrors => ({ ...prevErrors, niche_ids: errorMessage }))
          }
        })
      
      return updatedData
    })
  }

  // Verificar se o formulário é válido
  const isFormValid = useMemo(() => {
    const hasErrors = Object.values(errors).some(error => error !== undefined && error !== '')
    if (hasErrors) return false

    try {
      updateInformacoesBasicasSchema.validateSync(formData, { abortEarly: false })
      return true
    } catch {
      return false
    }
  }, [formData, errors])

  const handleSave = async () => {
    if (!store?.id) return
    
    try {
      await updateInformacoesBasicasSchema.validate(formData, { abortEarly: false })
      setErrors({})
      
      const updateData: any = {
        name: formData.name,
        description: formData.description || undefined,
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
      if (error instanceof yup.ValidationError) {
        const validationErrors: { [key: string]: string } = {}
        error.inner.forEach((err) => {
          if (err.path) {
            validationErrors[err.path] = err.message
          }
        })
        setErrors(validationErrors)
      } else {
        console.error('Erro ao atualizar informações básicas:', error)
      }
    }
  }

  return {
    store,
    isLoading,
    isUpdating,
    formData,
    errors,
    isFormValid,
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

