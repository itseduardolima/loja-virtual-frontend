'use client'

import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'

export function useVendedorPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { data: store, isLoading: storeLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()
  
  // Estados para upload de imagens
  const [isUploadingBanner, setIsUploadingBanner] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  
  // Estados para edição de contatos
  const [isEditingContacts, setIsEditingContacts] = useState(false)
  const [contactForm, setContactForm] = useState({
    whatsapp: '',
    instagram: '',
    facebook: '',
    website: '',
    email: '',
    phone: ''
  })
  
  // Refs para os inputs de arquivo
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  // Redirecionamento automático baseado no status da loja
  useEffect(() => {
    // Só redireciona se não estiver carregando e o usuário for vendedor
    if (!authLoading && !storeLoading && user?.profile === 'Vendedor') {
      if (!store) {
        // Se não tem loja, redireciona para criar loja
        router.push('/vendedor/criar-loja')
      }
      // Se tem loja, fica na página atual (/vendedor)
    }
  }, [authLoading, storeLoading, user?.profile, store, router])

  // Função para lidar com upload do banner
  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !store?.id) return

    setIsUploadingBanner(true)
    try {
      await updateStore({
        storeId: store.id,
        data: { banner: file }
      })
    } catch (error) {
      console.error('Erro ao atualizar banner:', error)
    } finally {
      setIsUploadingBanner(false)
    }
  }

  // Função para lidar com upload do logo
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !store?.id) return

    setIsUploadingLogo(true)
    try {
      await updateStore({
        storeId: store.id,
        data: { logo: file }
      })
    } catch (error) {
      console.error('Erro ao atualizar logo:', error)
    } finally {
      setIsUploadingLogo(false)
    }
  }

  // Função para iniciar edição de contatos
  const startEditingContacts = () => {
    setContactForm({
      whatsapp: store?.whatsapp || '',
      instagram: store?.instagram || '',
      facebook: (store as any)?.facebook || '',
      website: (store as any)?.website || '',
      email: (store as any)?.email || '',
      phone: (store as any)?.phone || ''
    })
    setIsEditingContacts(true)
  }

  // Função para cancelar edição de contatos
  const cancelEditingContacts = () => {
    setIsEditingContacts(false)
    setContactForm({
      whatsapp: '',
      instagram: '',
      facebook: '',
      website: '',
      email: '',
      phone: ''
    })
  }

  // Função para salvar contatos
  const saveContacts = async () => {
    if (!store?.id) return

    try {
      await updateStore({
        storeId: store.id,
        data: contactForm
      })
      setIsEditingContacts(false)
    } catch (error) {
      console.error('Erro ao atualizar contatos:', error)
    }
  }

  // Verificações de loading e autenticação
  if (authLoading || storeLoading) {
    return { 
      loading: true, 
      hasStore: false,
      user,
      router,
      // Campos opcionais para evitar erros de tipo
      store: undefined,
      isUpdating: false,
      isUploadingBanner: false,
      isUploadingLogo: false,
      isEditingContacts: false,
      setIsEditingContacts: () => {},
      contactForm: {
        whatsapp: '',
        instagram: '',
        facebook: '',
        website: '',
        email: '',
        phone: ''
      },
      setContactForm: () => {},
      bannerInputRef: { current: null },
      logoInputRef: { current: null },
      handleBannerUpload: () => {},
      handleLogoUpload: () => {},
      startEditingContacts: () => {},
      cancelEditingContacts: () => {},
      saveContacts: () => {}
    }
  }

  if (user?.profile !== 'Vendedor') {
    router.push('/login')
    return { 
      loading: true, 
      hasStore: false,
      user,
      router,
      // Campos opcionais para evitar erros de tipo
      store: undefined,
      isUpdating: false,
      isUploadingBanner: false,
      isUploadingLogo: false,
      isEditingContacts: false,
      setIsEditingContacts: () => {},
      contactForm: {
        whatsapp: '',
        instagram: '',
        facebook: '',
        website: '',
        email: '',
        phone: ''
      },
      setContactForm: () => {},
      bannerInputRef: { current: null },
      logoInputRef: { current: null },
      handleBannerUpload: () => {},
      handleLogoUpload: () => {},
      startEditingContacts: () => {},
      cancelEditingContacts: () => {},
      saveContacts: () => {}
    }
  }

  // Se não há loja, retornar dados para tela de criação
  if (!store) {
    return {
      loading: false,
      hasStore: false,
      user,
      router,
      // Campos opcionais para evitar erros de tipo
      store: undefined,
      isUpdating: false,
      isUploadingBanner: false,
      isUploadingLogo: false,
      isEditingContacts: false,
      setIsEditingContacts: () => {},
      contactForm: {
        whatsapp: '',
        instagram: '',
        facebook: '',
        website: '',
        email: '',
        phone: ''
      },
      setContactForm: () => {},
      bannerInputRef: { current: null },
      logoInputRef: { current: null },
      handleBannerUpload: () => {},
      handleLogoUpload: () => {},
      startEditingContacts: () => {},
      cancelEditingContacts: () => {},
      saveContacts: () => {}
    }
  }

  // Retornar dados para tela com loja
  return {
    loading: false,
    hasStore: true,
    user,
    store,
    isUpdating,
    isUploadingBanner,
    isUploadingLogo,
    isEditingContacts,
    setIsEditingContacts,
    contactForm,
    setContactForm,
    bannerInputRef,
    logoInputRef,
    handleBannerUpload,
    handleLogoUpload,
    startEditingContacts,
    cancelEditingContacts,
    saveContacts
  }
}
