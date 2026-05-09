import { useState, useEffect, useMemo } from 'react'
import * as yup from 'yup'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'
import { useAllNiches } from '@/hooks/useNiches'
import { updateNichosSchema } from '@/schemas'

export function useNichos() {
  const { data: store, isLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()
  const { data: nichesData, isLoading: nichesLoading } = useAllNiches()

  const [nicheIds, setNicheIds] = useState<string[]>([])
  const [serverNicheIds, setServerNicheIds] = useState<string[]>([])
  const [errors, setErrors] = useState<{ niche_ids?: string }>({})

  useEffect(() => {
    if (store) {
      const storeNiches = (store as any)?.store_niches || []
      const ids = storeNiches.map((sn: any) => sn.niche_id.toString())
      setNicheIds(ids)
      setServerNicheIds(ids)
    }
  }, [store])

  const handleNicheToggle = (nicheId: string) => {
    setNicheIds((prev) => {
      const isSelected = prev.includes(nicheId)
      const next = isSelected ? prev.filter((id) => id !== nicheId) : [...prev, nicheId]

      updateNichosSchema
        .validate({ niche_ids: next }, { abortEarly: false })
        .then(() => setErrors({}))
        .catch((error) => {
          if (error instanceof yup.ValidationError) {
            const fieldError = error.inner.find((err) => err.path === 'niche_ids')
            setErrors({ niche_ids: fieldError?.message || error.message })
          }
        })

      return next
    })
  }

  const isDirty = useMemo(() => {
    if (nicheIds.length !== serverNicheIds.length) return true
    const sortedA = [...nicheIds].sort()
    const sortedB = [...serverNicheIds].sort()
    return sortedA.some((id, i) => id !== sortedB[i])
  }, [nicheIds, serverNicheIds])

  const isFormValid = useMemo(() => {
    if (errors.niche_ids) return false
    try {
      updateNichosSchema.validateSync({ niche_ids: nicheIds }, { abortEarly: false })
      return true
    } catch {
      return false
    }
  }, [nicheIds, errors])

  const handleSave = async () => {
    if (!store?.id) return
    try {
      await updateNichosSchema.validate({ niche_ids: nicheIds }, { abortEarly: false })
      setErrors({})

      await updateStore({
        storeId: store.id,
        data: { niche_ids: nicheIds },
      })
      setServerNicheIds(nicheIds)
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors: { [key: string]: string } = {}
        error.inner.forEach((err) => {
          if (err.path) validationErrors[err.path] = err.message
        })
        setErrors(validationErrors)
      } else {
        console.error('Erro ao atualizar nichos:', error)
      }
    }
  }

  const handleReset = () => {
    setNicheIds(serverNicheIds)
    setErrors({})
  }

  return {
    isLoading,
    isUpdating,
    nichesData,
    nichesLoading,
    nicheIds,
    errors,
    isDirty,
    isFormValid,
    handleNicheToggle,
    handleSave,
    handleReset,
  }
}
