'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useCustomerProfile } from '@/hooks/useCustomerProfile'
import { CompleteProfileModal } from './CompleteProfileModal'
import type { CustomerProfile } from '@/types/customer'

function isProfileIncomplete(data: CustomerProfile | null | undefined): boolean {
  if (!data) return true
  const hasPhone = !!(data.phone && data.phone.replace(/\D/g, '').length >= 8)
  const hasAddress =
    !!(data.address_street?.trim() && data.address_city?.trim())
  return !hasPhone || !hasAddress
}

export function CompleteProfileGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const { fetchProfile } = useCustomerProfile()
  const [profileChecked, setProfileChecked] = useState(false)
  const [needsCompletion, setNeedsCompletion] = useState(false)
  const [profileData, setProfileData] = useState<CustomerProfile | null>(null)
  const cancelledRef = useRef(false)

  useEffect(() => {
    cancelledRef.current = false
    if (!isAuthenticated || !user) {
      setProfileChecked(true)
      setNeedsCompletion(false)
      setProfileData(null)
      return
    }
    if (user.profile !== 'Cliente') {
      setProfileChecked(true)
      setNeedsCompletion(false)
      return
    }
    setProfileChecked(false)
    fetchProfile()
      .then((res) => {
        if (cancelledRef.current) return
        const data = res?.data ?? null
        setProfileData(data)
        setNeedsCompletion(isProfileIncomplete(data))
      })
      .catch(() => {
        if (cancelledRef.current) return
        setProfileData(null)
        setNeedsCompletion(true)
      })
      .finally(() => {
        if (!cancelledRef.current) setProfileChecked(true)
      })
    return () => {
      cancelledRef.current = true
    }
  }, [isAuthenticated, user?.id, user?.profile, fetchProfile])

  const handleComplete = useCallback(() => {
    fetchProfile()
      .then((res) => {
        const data = res?.data ?? null
        setProfileData(data)
        setNeedsCompletion(isProfileIncomplete(data))
      })
      .catch(() => {
        setNeedsCompletion(false)
      })
  }, [fetchProfile])

  const showModal = profileChecked && needsCompletion && user?.profile === 'Cliente'

  return (
    <>
      {children}
      {showModal && (
        <CompleteProfileModal
          isOpen={true}
          initialData={profileData ?? undefined}
          onComplete={handleComplete}
        />
      )}
    </>
  )
}
