'use client'

import { useMemo, useState } from 'react'
import { LoadingSpinner } from '@/components'
import {
  Plus,
  Mail,
  Trash2,
  MoreHorizontal,
  X,
  Check,
  Tag as TagIcon,
  Plug,
  Clock,
  ShoppingBag,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useToastContext } from '@/contexts/ToastContext'
import {
  SectionCard,
  SectionHeader,
  Notice,
  FieldLabel,
  FieldHelp,
  NxButton,
} from '../_shared'

type Role = 'owner' | 'admin' | 'operator' | 'financial'
type Status = 'active' | 'invited'

interface Member {
  id: string
  name: string
  email: string
  role: Role
  status: Status
  lastSeen: string
  you?: boolean
}

const ROLES: Array<{
  id: Role
  label: string
  desc: string
  color: string
}> = [
  { id: 'owner', label: 'Dono', desc: 'Acesso total, incluindo cobrança e exclusão da loja.', color: '#7E5BD9' },
  { id: 'admin', label: 'Admin', desc: 'Gerencia tudo, exceto cobrança e exclusão.', color: '#2B6CB0' },
  { id: 'operator', label: 'Operador', desc: 'Pedidos, produtos e atendimento. Sem acesso a configurações.', color: '#308249' },
  { id: 'financial', label: 'Financeiro', desc: 'Vê pedidos e relatórios. Sem edição de produtos ou loja.', color: '#B37615' },
]
const ROLE_BY_ID = Object.fromEntries(ROLES.map((r) => [r.id, r])) as Record<Role, (typeof ROLES)[number]>

const INITIAL_MEMBERS: Member[] = [
  { id: 'u1', name: 'Mariana Tavares', email: 'mariana@suaempresa.com.br', role: 'owner', status: 'active', lastSeen: 'agora', you: true },
  { id: 'u2', name: 'Beatriz Lopes', email: 'bia@suaempresa.com.br', role: 'admin', status: 'active', lastSeen: 'há 12 min' },
  { id: 'u3', name: 'Rafael Mendes', email: 'rafael@suaempresa.com.br', role: 'operator', status: 'active', lastSeen: 'há 4 horas' },
  { id: 'u4', name: 'Júlia Carvalho', email: 'julia.contadora@gmail.com', role: 'financial', status: 'invited', lastSeen: 'convite há 2 dias' },
]

const AUDIT_LOG = [
  { who: 'Mariana Tavares', what: 'atualizou o horário de funcionamento', when: 'hoje · 09:42', icon: Clock },
  { who: 'Beatriz Lopes', what: 'alterou tabela de frete (3 faixas)', when: 'hoje · 08:15', icon: ShoppingBag },
  { who: 'Rafael Mendes', what: 'marcou 4 pedidos como entregues', when: 'ontem · 18:22', icon: Check },
  { who: 'Mariana Tavares', what: 'convidou Júlia Carvalho como Financeiro', when: '30 abr · 14:11', icon: Plus },
  { who: 'Beatriz Lopes', what: 'publicou 2 cupons de desconto', when: '29 abr · 11:05', icon: TagIcon },
  { who: 'Mariana Tavares', what: 'conectou conta do Bling', when: '28 abr · 16:48', icon: Plug },
]

function avatarColor(name: string) {
  const palette = ['#C13A2E', '#2B6CB0', '#308249', '#7E5BD9', '#B37615', '#0F766E']
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return palette[h % palette.length]
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
}

// ─── Invite Modal ────────────────────────────────────────────────────────────
function InviteModal({
  open,
  onOpenChange,
  onInvite,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onInvite: (emails: string[], role: Role) => void
}) {
  const [emails, setEmails] = useState<string[]>([])
  const [draft, setDraft] = useState('')
  const [role, setRole] = useState<Role>('operator')
  const [sending, setSending] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const reset = () => {
    setEmails([])
    setDraft('')
    setRole('operator')
    setErr(null)
  }

  const addChip = () => {
    const e = draft.trim().replace(/[,;]+$/, '')
    if (!e) return
    if (!isValidEmail(e)) {
      setErr('Email inválido.')
      return
    }
    if (emails.includes(e)) {
      setErr('Email já adicionado.')
      return
    }
    setEmails([...emails, e])
    setDraft('')
    setErr(null)
  }

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault()
      addChip()
    } else if (e.key === 'Backspace' && !draft && emails.length) {
      setEmails(emails.slice(0, -1))
    }
  }

  const send = () => {
    if (draft.trim()) addChip()
    const list =
      draft.trim() && isValidEmail(draft.trim()) && !emails.includes(draft.trim())
        ? [...emails, draft.trim()]
        : emails
    if (!list.length) {
      setErr('Adicione ao menos um email.')
      return
    }
    setSending(true)
    setTimeout(() => {
      onInvite(list, role)
      setSending(false)
      reset()
    }, 500)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!sending) {
          if (!o) reset()
          onOpenChange(o)
        }
      }}
    >
      <DialogContent className="max-w-[540px] rounded-2xl border-nxborder">
        <DialogHeader>
          <DialogTitle className="text-base font-bold tracking-[-0.01em] text-nxi1">
            Convidar para a equipe
          </DialogTitle>
          <DialogDescription className="text-[13px] text-nxi2">
            Cada pessoa recebe um email com um link de aceite válido por 7 dias.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Emails</FieldLabel>
            <div
              className={cn(
                'flex flex-wrap items-center gap-1.5 rounded-lg border bg-white px-2 py-1.5 transition-colors focus-within:border-nxp focus-within:ring-2 focus-within:ring-nxp/30',
                err ? 'border-nxd' : 'border-nxborder',
              )}
            >
              {emails.map((e, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full bg-nxbg px-2.5 py-0.5 text-[12px] font-semibold text-nxi1"
                >
                  {e}
                  <button
                    type="button"
                    onClick={() => setEmails(emails.filter((_, j) => j !== i))}
                    aria-label={`Remover ${e}`}
                    className="text-nxi3 hover:text-nxi1"
                  >
                    <X size={10} strokeWidth={3} />
                  </button>
                </span>
              ))}
              <input
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value)
                  setErr(null)
                }}
                onKeyDown={onKey}
                onBlur={() => draft.trim() && addChip()}
                placeholder={emails.length ? '' : 'fulano@empresa.com, beltrana@…'}
                autoFocus
                className="min-w-[180px] flex-1 border-0 bg-transparent text-[13px] text-nxi1 outline-none placeholder:text-nxi3"
              />
            </div>
            {err ? (
              <FieldHelp variant="error">{err}</FieldHelp>
            ) : (
              <FieldHelp>Pressione Enter, vírgula ou espaço para adicionar cada email.</FieldHelp>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel>Papel</FieldLabel>
            <div className="flex flex-col gap-2">
              {ROLES.filter((r) => r.id !== 'owner').map((r) => {
                const active = role === r.id
                return (
                  <label
                    key={r.id}
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors',
                      active
                        ? 'border-nxp/30 bg-nxp/[0.04]'
                        : 'border-nxborder bg-white hover:border-nxi3/30 hover:bg-nxbg/40',
                    )}
                  >
                    <input
                      type="radio"
                      name="invite-role"
                      checked={active}
                      onChange={() => setRole(r.id)}
                      className="mt-1 accent-nxp"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 text-[13.5px] font-semibold text-nxi1">
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ background: r.color }}
                        />
                        {r.label}
                      </div>
                      <p className="mt-0.5 text-[12.5px] text-nxi3">{r.desc}</p>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <NxButton
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={sending}
          >
            Cancelar
          </NxButton>
          <NxButton
            variant="primary"
            onClick={send}
            disabled={!emails.length && !draft.trim()}
            loading={sending}
          >
            {sending ? 'Enviando…' : `Enviar convite${emails.length > 1 ? 's' : ''}`}
          </NxButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function EquipePage() {
  const { toast } = useToastContext()
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS)
  const [showInvite, setShowInvite] = useState(false)
  const [menuFor, setMenuFor] = useState<string | null>(null)

  const counts = useMemo(() => {
    const active = members.filter((m) => m.status === 'active').length
    const invited = members.filter((m) => m.status === 'invited').length
    return { active, invited }
  }, [members])

  const handleInvite = (emails: string[], role: Role) => {
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

  const changeRole = (id: string, role: Role) => {
    setMembers(members.map((m) => (m.id === id ? { ...m, role } : m)))
    setMenuFor(null)
    toast({ title: 'Papel atualizado', variant: 'success' })
  }

  const resendInvite = (m: Member) => {
    setMenuFor(null)
    toast({ title: `Convite reenviado para ${m.email}.`, variant: 'success' })
  }

  const removeMember = (m: Member) => {
    setMembers(members.filter((x) => x.id !== m.id))
    setMenuFor(null)
    toast({ title: `${m.name} removido(a) da equipe.`, variant: 'success' })
  }

  return (
    <div className="flex flex-col gap-4">
      <Notice variant="info">
        Esta seção é uma <strong>prévia visual</strong> — convites e auditoria ainda não persistem.
      </Notice>

      {/* Membros */}
      <SectionCard>
        <SectionHeader
          title="Equipe"
          description={
            <>
              <strong className="text-nxi1">{counts.active}</strong>{' '}
              {counts.active === 1 ? 'pessoa ativa' : 'pessoas ativas'}
              {counts.invited > 0 && (
                <>
                  {' · '}
                  <strong className="text-nxi1">{counts.invited}</strong>{' '}
                  {counts.invited === 1 ? 'convite pendente' : 'convites pendentes'}
                </>
              )}
            </>
          }
          right={
            <NxButton variant="primary" onClick={() => setShowInvite(true)}>
              <Plus size={14} strokeWidth={2.5} />
              Convidar pessoa
            </NxButton>
          }
        />

        <div className="overflow-hidden rounded-xl border border-nxborder">
          <div className="grid grid-cols-[1fr_140px_180px_44px] items-center gap-3 border-b border-nxborder bg-nxbg/40 px-4 py-2.5 text-[10.5px] font-bold uppercase tracking-[0.06em] text-nxi3">
            <div>Pessoa</div>
            <div>Papel</div>
            <div>Status</div>
            <div className="sr-only">Ações</div>
          </div>

          {members.map((m) => {
            const role = ROLE_BY_ID[m.role]
            return (
              <div
                key={m.id}
                className="grid grid-cols-[1fr_140px_180px_44px] items-center gap-3 border-b border-nxborder/70 bg-white px-4 py-3 text-[13px] last:border-0 hover:bg-nxbg/40"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                    style={{ background: avatarColor(m.name) }}
                  >
                    {initials(m.name)}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 truncate font-semibold text-nxi1">
                      {m.name}
                      {m.you && (
                        <span className="rounded-full bg-nxbg px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.04em] text-nxi3">
                          você
                        </span>
                      )}
                    </div>
                    <div className="truncate text-[12px] text-nxi3">{m.email}</div>
                  </div>
                </div>

                <div>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11.5px] font-semibold"
                    style={{ borderColor: `${role.color}40`, color: role.color }}
                  >
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ background: role.color }}
                    />
                    {role.label}
                  </span>
                </div>

                <div className="text-[12px] font-medium">
                  {m.status === 'active' ? (
                    <span className="text-nxs">Ativo · {m.lastSeen}</span>
                  ) : (
                    <span className="text-nxw">Aguardando aceite</span>
                  )}
                </div>

                <div className="relative justify-self-end">
                  {!m.you && (
                    <>
                      <button
                        type="button"
                        onClick={() => setMenuFor(menuFor === m.id ? null : m.id)}
                        aria-label={`Ações para ${m.name}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-nxi3 hover:border-nxborder hover:bg-white hover:text-nxi1"
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      {menuFor === m.id && (
                        <div className="absolute right-0 top-9 z-10 w-56 rounded-xl border border-nxborder bg-white p-1 shadow-[0_8px_24px_hsl(0_0%_0%/0.10)]">
                          <div className="px-2.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.06em] text-nxi3">
                            Mudar papel para
                          </div>
                          {ROLES.filter((r) => r.id !== 'owner' && r.id !== m.role).map((r) => (
                            <button
                              key={r.id}
                              onClick={() => changeRole(m.id, r.id)}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[12.5px] text-nxi1 hover:bg-nxbg"
                            >
                              <span
                                className="inline-block h-1.5 w-1.5 rounded-full"
                                style={{ background: r.color }}
                              />
                              {r.label}
                            </button>
                          ))}
                          <div className="my-1 h-px bg-nxborder" />
                          {m.status === 'invited' && (
                            <button
                              onClick={() => resendInvite(m)}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[12.5px] text-nxi1 hover:bg-nxbg"
                            >
                              <Mail size={13} />
                              Reenviar convite
                            </button>
                          )}
                          <button
                            onClick={() => removeMember(m)}
                            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[12.5px] text-nxd hover:bg-nxd/[0.06]"
                          >
                            <Trash2 size={13} />
                            {m.status === 'invited' ? 'Cancelar convite' : 'Remover da equipe'}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </SectionCard>

      {/* Auditoria */}
      <SectionCard>
        <SectionHeader
          title="Atividade recente"
          description="Histórico das últimas alterações feitas pela equipe na loja."
        />

        <div className="flex flex-col gap-1.5">
          {AUDIT_LOG.map((a, i) => {
            const Icon = a.icon
            return (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg px-1 py-1.5 hover:bg-nxbg/50"
              >
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-nxp/10 text-nxp">
                  <Icon size={12} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] text-nxi1">
                    <strong className="font-semibold">{a.who}</strong>{' '}
                    <span className="text-nxi2">{a.what}</span>
                  </div>
                  <div className="text-[11px] text-nxi3">{a.when}</div>
                </div>
              </div>
            )
          })}
        </div>
      </SectionCard>

      <InviteModal
        open={showInvite}
        onOpenChange={setShowInvite}
        onInvite={handleInvite}
      />
    </div>
  )
}
