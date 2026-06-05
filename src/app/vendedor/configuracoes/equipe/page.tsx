'use client'

import {
  Plus,
  Mail,
  Trash2,
  MoreHorizontal,
  Tag as TagIcon,
  Plug,
  Clock,
  ShoppingBag,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getInitials, avatarHueFor } from '@/lib/vendor'
import { SectionCard, SectionHeader, Notice } from '../_shared'
import { InviteModal } from './_components/InviteModal'
import { useEquipePage, ROLES, ROLE_BY_ID } from './useEquipePage'
import { NxButton } from '../_shared'

// ─── Audit log (static mock — TODO: substituir por data hook quando o backend existir) ──
const AUDIT_LOG = [
  { who: 'Mariana Tavares', what: 'atualizou o horário de funcionamento',   when: 'hoje · 09:42',   icon: Clock },
  { who: 'Beatriz Lopes',   what: 'alterou tabela de frete (3 faixas)',     when: 'hoje · 08:15',   icon: ShoppingBag },
  { who: 'Rafael Mendes',   what: 'marcou 4 pedidos como entregues',        when: 'ontem · 18:22',  icon: Check },
  { who: 'Mariana Tavares', what: 'convidou Júlia Carvalho como Financeiro', when: '30 abr · 14:11', icon: Plus },
  { who: 'Beatriz Lopes',   what: 'publicou 2 cupons de desconto',          when: '29 abr · 11:05', icon: TagIcon },
  { who: 'Mariana Tavares', what: 'conectou conta do Bling',                when: '28 abr · 16:48', icon: Plug },
]

export default function EquipePage() {
  const {
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
  } = useEquipePage()

  return (
    <div className="flex flex-col gap-4">
      <Notice variant="info">
        Esta seção é uma <strong>prévia visual</strong> — convites e auditoria ainda não persistem.
      </Notice>

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-3">
        {/* Pessoas ativas */}
        <div className="rounded-2xl border border-nxborder bg-white p-4 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-nxi3">
              Pessoas ativas
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-nxs/10 text-nxs">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 7L9 18l-5-5"/>
              </svg>
            </span>
          </div>
          <div className="mt-2 text-[22px] font-extrabold leading-[1.1] tracking-[-0.03em] text-nxi1 tabular-nums">
            {counts.active}
          </div>
        </div>

        {/* Convites pendentes */}
        <div className="rounded-2xl border border-nxborder bg-white p-4 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-nxi3">
              Convites pendentes
            </span>
            <span className={cn(
              'flex h-7 w-7 items-center justify-center rounded-lg',
              counts.invited > 0 ? 'bg-nxw/10 text-nxw' : 'bg-nxbg text-nxi3',
            )}>
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
              </svg>
            </span>
          </div>
          <div className="mt-2 text-[22px] font-extrabold leading-[1.1] tracking-[-0.03em] text-nxi1 tabular-nums">
            {counts.invited}
          </div>
        </div>

        {/* Papéis em uso */}
        <div className="rounded-2xl border border-nxborder bg-white p-4 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-nxi3">
              Papéis em uso
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-nxp/10 text-nxp">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s-8-4.5-8-11.8A5.2 5.2 0 0 1 12 5a5.2 5.2 0 0 1 8 5.2C20 17.5 12 22 12 22Z"/>
              </svg>
            </span>
          </div>
          <div className="mt-2 text-[22px] font-extrabold leading-[1.1] tracking-[-0.03em] text-nxi1 tabular-nums">
            {counts.rolesUsed}
            <span className="text-[14px] font-bold text-nxi3">/{ROLES.length}</span>
          </div>
        </div>
      </div>

      {/* Members table */}
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
          {/* Table header */}
          <div className="grid grid-cols-[1fr_140px_180px_44px] items-center gap-3 border-b border-nxborder bg-nxbg/40 px-4 py-2.5 text-[10.5px] font-bold uppercase tracking-[0.06em] text-nxi3">
            <div>Pessoa</div>
            <div>Papel</div>
            <div>Status</div>
            <div className="sr-only">Ações</div>
          </div>

          {/* Table rows */}
          {members.map((m) => {
            const role = ROLE_BY_ID[m.role]
            return (
              <div
                key={m.id}
                className="grid grid-cols-[1fr_140px_180px_44px] items-center gap-3 border-b border-nxborder/70 bg-white px-4 py-3 text-[13px] last:border-0 hover:bg-nxbg/40"
              >
                {/* Avatar + name */}
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                    style={{ background: avatarHueFor(m.name) }}
                  >
                    {getInitials(m.name)}
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

                {/* Role badge */}
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

                {/* Status */}
                <div className="text-[12px] font-medium">
                  {m.status === 'active' ? (
                    <span className="text-nxs">Ativo · {m.lastSeen}</span>
                  ) : (
                    <span className="text-nxw">Aguardando aceite</span>
                  )}
                </div>

                {/* Actions menu */}
                <div className="relative justify-self-end">
                  {!m.you && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleMenuToggle(m.id)}
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
                              onClick={() => handleChangeRole(m.id, r.id)}
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
                              onClick={() => handleResendInvite(m)}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[12.5px] text-nxi1 hover:bg-nxbg"
                            >
                              <Mail size={13} />
                              Reenviar convite
                            </button>
                          )}
                          <button
                            onClick={() => handleRemoveMember(m)}
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

      {/* Audit log */}
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
