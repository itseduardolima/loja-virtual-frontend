'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { AxiosError } from 'axios'
import { useStoreInfo } from '@/hooks/useStoreInfo'
import { useCart } from '@/hooks/useCart'
import { useCheckout } from '@/hooks/useCheckout'
import { useAuth } from '@/contexts/AuthContext'
import { useCustomerProfile } from '@/hooks/useCustomerProfile'
import { useAddresses } from '@/hooks/useAddresses'
import { checkoutFormSchema } from '@/schemas/checkoutSchemas'
import { api } from '@/lib/api'
import type { User } from '@/types/auth'

export interface CouponResult {
  coupon_code: string
  type: string
  value: number
  discount: number
  original_total: number
  final_total: number
}

export interface AddressFormData {
  label: string
  name: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  zipcode: string
  is_default: number
}

export const emptyAddressForm: AddressFormData = {
  label: '',
  name: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zipcode: '',
  is_default: 0,
}

export function useCheckoutPage() {
  const params = useParams()
  const slug = params.slug as string

  // UI state — focusedField controls character-count hints in the form
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const { storeInfo, loading: storeLoading } = useStoreInfo(slug)
  const storeId = storeInfo?.id
  const { cartItems, totalPrice, sessionId, isLoadingCart } = useCart(storeId)
  const { checkout, isCheckoutLoading } = useCheckout()
  const { user, isAuthenticated } = useAuth()
  const { fetchProfile } = useCustomerProfile()
  const { addresses, isLoading: addressesLoading, createAddress, isCreating } = useAddresses(isAuthenticated)

  // Customer form
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_document: '',
    notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Coupon
  const [couponInput, setCouponInput] = useState('')
  const [couponResult, setCouponResult] = useState<CouponResult | null>(null)
  const [couponError, setCouponError] = useState('')
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)

  // Delivery address
  const [addressError, setAddressError] = useState('')
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressForm, setAddressForm] = useState<AddressFormData>(emptyAddressForm)
  const [useManualAddress, setUseManualAddress] = useState(false)
  const [showAddresses, setShowAddresses] = useState(true)
  const [isFetchingCep, setIsFetchingCep] = useState(false)
  const [cepError, setCepError] = useState('')

  // Load user data on mount
  useEffect(() => {
    const userDataStr = typeof window !== 'undefined' ? localStorage.getItem('user-data') : null
    let fallback: User | null = null
    if (user) fallback = user
    else if (userDataStr) {
      try { fallback = JSON.parse(userDataStr) as User } catch { /* */ }
    }

    if (fallback) {
      setFormData(prev => ({
        ...prev,
        customer_name: fallback.name || prev.customer_name,
        customer_email: fallback.email || prev.customer_email,
      }))
    }

    if (isAuthenticated) {
      fetchProfile()
        .then((res) => {
          const data = res?.data
          if (data) {
            setFormData(prev => ({
              ...prev,
              customer_name: data.name || prev.customer_name,
              customer_email: data.email || prev.customer_email,
              customer_phone: data.phone || prev.customer_phone,
              customer_document: data.document || prev.customer_document,
            }))
          }
        })
        .catch(() => {})
    }
  }, [user, isAuthenticated])

  // Auto-select default address
  useEffect(() => {
    if (addresses.length > 0 && selectedAddressId === null) {
      const def = addresses.find(a => a.is_default === 1)
      setSelectedAddressId(def?.id ?? addresses[0].id)
    }
  }, [addresses, selectedAddressId])

  const handleZipcodeChange = async (value: string) => {
    const formatted = value.slice(0, 9)
    setAddressForm(p => ({ ...p, zipcode: formatted }))
    setCepError('')

    const digits = formatted.replace(/\D/g, '')
    if (digits.length === 8) {
      setIsFetchingCep(true)
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 5000)
      try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`, { signal: controller.signal })
        clearTimeout(timer)
        if (!res.ok) throw new Error('CEP inválido')
        const data = await res.json()
        if (data.erro) {
          setCepError('CEP não encontrado')
        } else {
          setAddressForm(p => ({
            ...p,
            zipcode: formatted,
            street: data.logradouro || p.street,
            neighborhood: data.bairro || p.neighborhood,
            city: data.localidade || p.city,
            state: data.uf || p.state,
          }))
        }
      } catch (err: unknown) {
        clearTimeout(timer)
        const isAbort = err instanceof Error && err.name === 'AbortError'
        setCepError(isAbort ? 'Tempo limite de consulta excedido' : 'Erro ao consultar o CEP')
      } finally {
        setIsFetchingCep(false)
      }
    }
  }

  const hasItems = Array.isArray(cartItems) && cartItems.length > 0
  const finalTotal = couponResult ? couponResult.final_total : totalPrice

  const handleInput = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
    }
  }

  const handleValidateCoupon = async () => {
    if (!couponInput.trim() || !storeId) return
    setIsValidatingCoupon(true)
    setCouponError('')
    setCouponResult(null)
    try {
      const res = await api.post<{ data: CouponResult }>('/coupons/validate', {
        code: couponInput.trim(),
        order_total: totalPrice,
      }, { params: { store_id: storeId } })
      setCouponResult(res.data.data)
    } catch (err: unknown) {
      const axiosErr = err instanceof AxiosError ? err : null
      setCouponError(axiosErr?.response?.data?.message || 'Cupom inválido')
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCouponResult(null)
    setCouponInput('')
    setCouponError('')
  }

  const getDeliveryAddressJson = (): string | undefined => {
    if (selectedAddressId && !useManualAddress) {
      const addr = addresses.find(a => a.id === selectedAddressId)
      if (addr) return JSON.stringify(addr)
    }
    if (useManualAddress && addressForm.street && addressForm.city) {
      return JSON.stringify(addressForm)
    }
    return undefined
  }

  const handleSaveAndSelectAddress = async () => {
    if (!addressForm.name || !addressForm.street || !addressForm.city || !addressForm.state || !addressForm.zipcode) return
    const result = await createAddress({
      ...addressForm,
      is_default: addressForm.is_default,
    })
    if (result?.data?.id) {
      setSelectedAddressId(result.data.id)
      setShowAddressForm(false)
      setAddressForm(emptyAddressForm)
      setUseManualAddress(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setAddressError('')

    try {
      await checkoutFormSchema.validate(formData, { abortEarly: false })
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'inner' in err) {
        const yupErr = err as { inner: Array<{ path?: string; message?: string }> }
        const next: Record<string, string> = {}
        for (const e of yupErr.inner || []) {
          if (e.path && e.message) next[e.path] = e.message
        }
        setErrors(next)
        return
      }
    }

    const deliveryAddress = getDeliveryAddressJson()
    if (!deliveryAddress) {
      setAddressError('Informe um endereço de entrega para continuar.')
      return
    }

    if (!sessionId || !storeId) return

    const cleanDocument = formData.customer_document.replace(/\D/g, '') || undefined

    if (isAuthenticated && cleanDocument) {
      api.patch('/customers/profile', { document: cleanDocument }).catch(() => {})
    }

    await checkout(
      sessionId,
      storeId,
      {
        customer_name: formData.customer_name.trim(),
        customer_email: formData.customer_email.trim(),
        customer_phone: formData.customer_phone.trim(),
        customer_document: cleanDocument,
        notes: formData.notes.trim() || undefined,
        coupon_code: couponResult?.coupon_code,
        delivery_address: deliveryAddress,
      },
      slug,
    )
  }

  return {
    // Route
    slug,

    // UI
    focusedField,
    setFocusedField,

    // Store
    storeLoading,

    // Cart
    cartItems,
    totalPrice,
    isLoadingCart,

    // Auth
    user,
    isAuthenticated,

    // Addresses
    addresses,
    addressesLoading,
    isCreating,
    addressError,
    isFetchingCep,
    cepError,
    handleZipcodeChange,
    selectedAddressId,
    setSelectedAddressId,
    showAddressForm,
    setShowAddressForm,
    addressForm,
    setAddressForm,
    useManualAddress,
    setUseManualAddress,
    showAddresses,
    setShowAddresses,

    // Customer form
    formData,
    errors,
    handleInput,

    // Coupon
    couponInput,
    setCouponInput,
    couponResult,
    couponError,
    setCouponError,
    isValidatingCoupon,
    handleValidateCoupon,
    handleRemoveCoupon,

    // Computed
    hasItems,
    finalTotal,

    // Submit
    isCheckoutLoading,
    handleSubmit,
    handleSaveAndSelectAddress,
  }
}
