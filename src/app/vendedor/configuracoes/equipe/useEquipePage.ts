'use client'

import { useMemo, useState } from 'react'
import { useToastContext } from '@/contexts/ToastContext'

export type Role = 'owner' | 'admin' | 'operator' | 'financial'
export type Status = 'active' | 'invited'

export interface Member {
  id: string
  name: string
  email: string
  role: Role
  status: Status
  lastSeen: string
  you?: boolean
}

export const ROLES: Array<{
  id: Role
  label: string
  desc: string
  color: string
}> = [
  { id: 'owner',     label: 'Dono',       desc: 'Acesso total, incluindo cobrança e exclusão da loja.',                 color: '#7E5BD9' },
  { id: 'admin',     label: 'Admin',      desc: 'Gerencia tudo, exceto cobrança e exclusão.',                           color: '#2B6CB0' },
  { id: 'operator',  label: 'Operador',   desc: 'Pedidos, produtos e atendimento. Sem acesso a configurações.',         color: '#308249' },
  { id: 'financial', label: 'Financeiro', desc: 'Vê pedidos e relatórios. Sem edição de produtos ou loja.',            color: '#B37615' },
]

export const ROLE_BY_ID = Object.fromEntries(ROLES.map((r) => [r.id, r])) as Record<Role, (typeof ROLES)[number]>

// TODO: substituir por data hook quando o backend de equipe existir
const INITIAL_MEMBERS: Member[] = [
  { id: 'u1', name: 'Mariana Tavares',  email: 'mariana@suaempresa.com.br',  role: 'owner',     status: 'active',  lastSeen: 'agora',          you: true },
  { id: 'u2', name: 'Beatriz Lopes',    email: 'bia@suaempresa.com.br',      role: 'admin',     status: 'active',  lastSeen: 'há 12 min' },
  { id: 'u3', name: 'Rafael Mendes',    email: 'rafael@suaempresa.com.br',   role: 'operator',  status: 'active',  lastSeen: 'há 4 horas' },
  { id: 'u4', name: 'Júlia Carvalho',   email: 'julia.contadora@gmail.com',  role: 'financial', status: 'invited', lastSeen: 'convite há 2 dias' },
]

export function useEquipePage() {
  const { toast } = useToastContext()

  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS)
  const [showInvite, setShowInvite] = useState(false)
  const [menuFor, setMenuFor] = useState<string | null>(null)

  const counts = useMemo(() => {
    const active    = members.filter((m) => m.status === 'active').length
    const invited   = members.filter((m) => m.status === 'invited').length
    const rolesUsed = new Set(members.map((m) => m.role)).size
    return { active, invited, rolesUsed }
  }, [members])

  function handleInvite(emails: string[], role: Role) {
    const newOnes: Member[] = emails.map((email, i) => ({
      id: 'n-' + Date.now() + '-' + i,
      name: email.split('@')[0],
      email,
      role,
      status: 'invited',
      lastSeen: 'convite enviado agora',
    }))
    setMembers((m) => [...m, ...newOnes])
    setShowInvite(false)
    toast({
      title: 'Convites enviados!',
      description: `Para ${emails.length} ${emails.length > 1 ? 'pessoas' : 'pessoa'}.`,
      variant: 'success',
    })
  }

  function handleChangeRole(id: string, role: Role) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)))
    setMenuFor(null)
    toast({ title: 'Papel atualizado', variant: 'success' })
  }

  function handleResendInvite(m: Member) {
    setMenuFor(null)
    toast({ title: `Convite reenviado para ${m.email}.`, variant: 'success' })
  }

  function handleRemoveMember(m: Member) {
    setMembers((prev) => prev.filter((x) => x.id !== m.id))
    setMenuFor(null)
    toast({ title: `${m.name} removido(a) da equipe.`, variant: 'success' })
  }

  function handleMenuToggle(id: string) {
    setMenuFor((cur) => (cur === id ? null : id))
  }

  return {
    members,
    counts,
    showInvite,
    setShowInvite,
    menuFor,
    handleMenuToggle,
    handleInvite,
    handleChangeRole,
    handleResendInvite,
    handleRemoveMember,
  }
}
