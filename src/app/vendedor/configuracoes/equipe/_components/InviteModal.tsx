'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { isValidEmail } from '@/lib/utils'
import { FieldLabel, FieldHelp, NxButton } from '../../_shared'
import { ROLES, type Role } from '../useEquipePage'

// Note: avatarColor local usava paleta de 6 cores; avatarHueFor (@/lib/vendor) usa 7.
// O algoritmo de hash é idêntico — preferida a versão central conforme spec.

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onInvite: (emails: string[], role: Role) => void
}

export function InviteModal({ open, onOpenChange, onInvite }: Props) {
  const [emails, setEmails] = useState<string[]>([])
  const [draft, setDraft] = useState('')
  const [role, setRole] = useState<Role>('operator')
  const [sending, setSending] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  function reset() {
    setEmails([])
    setDraft('')
    setRole('operator')
    setErr(null)
  }

  function addChip() {
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

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault()
      addChip()
    } else if (e.key === 'Backspace' && !draft && emails.length) {
      setEmails(emails.slice(0, -1))
    }
  }

  function send() {
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
          {/* Email chips input */}
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

          {/* Role selector */}
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
          <NxButton variant="ghost" onClick={() => onOpenChange(false)} disabled={sending}>
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
