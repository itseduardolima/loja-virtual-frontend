'use client'

import { useAuth } from '@/contexts/AuthContext'
import { PROFILE_TRANSACTIONS } from '@/types/auth'

export function usePermissions() {
  const { user } = useAuth()

  const hasTransaction = (transactionId: number): boolean => {
    if (!user) return false
    return user.transactions.includes(transactionId)
  }

  const hasAnyTransaction = (transactionIds: number[]): boolean => {
    if (!user) return false
    return transactionIds.some(id => user.transactions.includes(id))
  }

  const getAllowedTransactions = (): number[] => {
    if (!user) return []
    return user.transactions
  }

  const getProfileTransactions = (): number[] => {
    if (!user) return []
    return [...(PROFILE_TRANSACTIONS[user.profile] || [])]
  }

  const isAdmin = (): boolean => {
    return user?.profile === 'Administrador'
  }

  const isVendedor = (): boolean => {
    return user?.profile === 'Vendedor'
  }

  const isCliente = (): boolean => {
    return user?.profile === 'Cliente'
  }

  return {
    hasTransaction,
    hasAnyTransaction,
    getAllowedTransactions,
    getProfileTransactions,
    isAdmin,
    isVendedor,
    isCliente,
    user
  }
}
