import { useState, useEffect, useMemo } from 'react'
import * as yup from 'yup'
import isEqual from 'lodash/isEqual'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'
import { updateInformacoesBasicasSchema } from '@/schemas'
import type { UpdateStoreData } from '@/types'

const initial = { name: '', description: '' }

export function useInformacoesBasicas() {
  const { data: store, isLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()

  const [formData, setFormData] = useState(initial)
  const [server, setServer] = useState(initial)

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
      const next = {
        name: store.name || '',
        description: store.description || '',
      }
      setFormData(next)
      setServer(next)

      if (store.logo) {
        setLogoPreview(store.logo)
      }
      if (store.banner) {
        setBannerPreview(store.banner)
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

  const isDirty = useMemo(
    () => !isEqual(formData, server) || logoFile !== null || bannerFile !== null,
    [formData, server, logoFile, bannerFile],
  )

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

  const handleReset = () => {
    setFormData(server)
    setErrors({})
    setLogoFile(null)
    setBannerFile(null)
    setLogoPreview(store?.logo || null)
    setBannerPreview(store?.banner || null)
    setCropTarget(null)
  }

  const handleSave = async () => {
    if (!store?.id) return

    try {
      await updateInformacoesBasicasSchema.validate(formData, { abortEarly: false })
      setErrors({})

      const updateData: Partial<UpdateStoreData> = {
        name: formData.name,
        description: formData.description || undefined,
      }

      if (logoFile) updateData.logo = logoFile
      if (bannerFile) updateData.banner = bannerFile

      await updateStore({
        storeId: store.id,
        data: updateData,
      })
      setServer(formData)
      setLogoFile(null)
      setBannerFile(null)
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
    isDirty,
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
    handleReset,
  }
}
