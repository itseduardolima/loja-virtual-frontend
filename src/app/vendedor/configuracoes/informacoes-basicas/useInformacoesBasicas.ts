import { useState, useEffect, useMemo } from 'react'
import * as yup from 'yup'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'
import { updateInformacoesBasicasSchema } from '@/schemas'

export function useInformacoesBasicas() {
  const { data: store, isLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  const [errors, setErrors] = useState<{
    name?: string
    description?: string
  }>({})

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [cropTarget, setCropTarget] = useState<{
    type: 'logo' | 'banner'
    imageSrc: string
    fileName: string
  } | null>(null)

  useEffect(() => {
    if (store) {
      setFormData({
        name: (store as any)?.name || '',
        description: (store as any)?.description || '',
      })

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
            const fieldError = error.inner.find(err => err.path === field)
            const errorMessage = fieldError?.message || error.message
            setErrors(prevErrors => ({ ...prevErrors, [field]: errorMessage }))
          }
        })

      return updatedData
    })
  }

  const handleFileSelect = (type: 'logo' | 'banner', file: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) =>
      setCropTarget({ type, imageSrc: e.target?.result as string, fileName: file.name })
    reader.readAsDataURL(file)
  }

  const handleCropDone = (type: 'logo' | 'banner', croppedFile: File, previewUrl: string) => {
    if (type === 'logo') {
      setLogoFile(croppedFile)
      setLogoPreview(previewUrl)
    } else {
      setBannerFile(croppedFile)
      setBannerPreview(previewUrl)
    }
    setCropTarget(null)
  }

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
      }

      if (logoFile) updateData.logo = logoFile
      if (bannerFile) updateData.banner = bannerFile

      await updateStore({
        storeId: store.id,
        data: updateData,
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
    handleInputChange,
    handleFileSelect,
    handleCropDone,
    cropTarget,
    setCropTarget,
    handleSave,
  }
}
