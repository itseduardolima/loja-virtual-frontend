import { useState, useEffect, useMemo } from 'react'
import isEqual from 'lodash/isEqual'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'

interface EntregaFormData {
  pickup_enabled: boolean
  free_shipping_enabled: boolean
  free_shipping_min: string
}

const initial: EntregaFormData = {
  pickup_enabled: false,
  free_shipping_enabled: false,
  free_shipping_min: '',
}

export function useEntrega() {
  const { data: store, isLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()

  const [formData, setFormData] = useState<EntregaFormData>(initial)
  const [server, setServer] = useState<EntregaFormData>(initial)
  const [errors, setErrors] = useState<{ free_shipping_min?: string; _global?: string }>({})

  // Sincroniza com a loja
  useEffect(() => {
    if (!store) return
    const minVal = store.free_delivery_min
    const minStr = minVal != null && minVal !== '' && Number(minVal) > 0 ? String(minVal) : ''

    const next: EntregaFormData = {
      pickup_enabled: !!store.pickup_enabled,
      free_shipping_enabled: minStr !== '',
      free_shipping_min: minStr,
    }
    setFormData(next)
    setServer(next)
  }, [store])

  const isDirty = useMemo(() => !isEqual(formData, server), [formData, server])

  const validate = (data: EntregaFormData) => {
    const errs: typeof errors = {}
    if (data.free_shipping_enabled) {
      const num = parseFloat(data.free_shipping_min.replace(',', '.'))
      if (isNaN(num) || num <= 0) {
        errs.free_shipping_min = 'Informe um valor mínimo maior que zero.'
      }
    }
    if (!data.pickup_enabled && !data.free_shipping_enabled) {
      errs._global = 'Habilite ao menos um método de entrega.'
    }
    return errs
  }

  const setPickupEnabled = (next: boolean) => {
    setFormData((prev) => {
      const updated = { ...prev, pickup_enabled: next }
      setErrors(validate(updated))
      return updated
    })
  }

  const setFreeShippingEnabled = (next: boolean) => {
    setFormData((prev) => {
      const updated = { ...prev, free_shipping_enabled: next }
      setErrors(validate(updated))
      return updated
    })
  }

  const setFreeShippingMin = (value: string) => {
    // Permite só números, vírgula e ponto
    const sanitized = value.replace(/[^\d.,]/g, '')
    setFormData((prev) => {
      const updated = { ...prev, free_shipping_min: sanitized }
      setErrors(validate(updated))
      return updated
    })
  }

  const isFormValid = useMemo(() => {
    const errs = validate(formData)
    return Object.keys(errs).length === 0
  }, [formData])

  const handleSave = async () => {
    if (!store?.id) return
    const errs = validate(formData)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})

    const minNum = formData.free_shipping_enabled
      ? parseFloat(formData.free_shipping_min.replace(',', '.'))
      : 0

    try {
      await updateStore({
        storeId: store.id,
        data: {
          pickup_enabled: formData.pickup_enabled,
          free_delivery_min: isNaN(minNum) ? 0 : minNum,
          delivery_fee: 0,
        },
      })
      setServer(formData)
    } catch (err) {
      console.error('Erro ao salvar entrega:', err)
    }
  }

  const handleReset = () => {
    setFormData(server)
    setErrors({})
  }

  return {
    isLoading,
    isUpdating,
    formData,
    errors,
    isDirty,
    isFormValid,
    setPickupEnabled,
    setFreeShippingEnabled,
    setFreeShippingMin,
    handleSave,
    handleReset,
    storeAddress: store
      ? {
          address: store.address || '',
          number: store.number || '',
          complement: store.complement || '',
          neighborhood: store.neighborhood || '',
          city: store.city || '',
          state: store.state || '',
          zipcode: store.zipcode || '',
        }
      : null,
  }
}
