'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useState } from 'react'
import { User, Pencil, X, Check } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAdminUser, useAdminUpdateUser } from '@/hooks/useAdminUsers'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import toast from 'react-hot-toast'

const editUserSchema = yup.object({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .min(5, 'Mínimo 5 caracteres')
    .max(40, 'Máximo 40 caracteres')
    .matches(/^[a-zA-ZÀ-ÿçÇ]+(\s+[a-zA-ZÀ-ÿçÇ]+)*$/, 'Somente letras'),
  email: yup
    .string()
    .required('Email é obrigatório')
    .min(10, 'Mínimo 10 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .matches(/^[\w\-.]+@([\w-]+\.)+[a-zA-Z]{2,4}$/, 'Informe um e-mail válido'),
  profile_id: yup.string().required('Selecione um perfil'),
})

type EditUserForm = yup.InferType<typeof editUserSchema>

interface UserDetailDrawerProps {
  userId: number | null
  open: boolean
  onClose: () => void
}

const profileNames: Record<number, string> = {
  1: 'Administrador',
  2: 'Vendedor',
  3: 'Cliente',
}

export function UserDetailDrawer({ userId, open, onClose }: UserDetailDrawerProps) {
  const { data: user, isLoading } = useAdminUser(userId ?? 0)
  const updateUser = useAdminUpdateUser()
  const [editing, setEditing] = useState(false)

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<EditUserForm>({
    resolver: yupResolver(editUserSchema),
    mode: 'onChange',
  })

  useEffect(() => {
    setEditing(false)
    reset()
  }, [userId, reset])

  const startEdit = () => {
    if (!user) return
    reset({ name: user.name ?? '', email: user.email ?? '', profile_id: String(user.profile_id) })
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    reset()
  }

  const onSubmit = async (values: EditUserForm) => {
    if (!userId) return
    try {
      await updateUser.mutateAsync({
        id: userId,
        data: { user_name: values.name, user_email: values.email, profile_id: Number(values.profile_id) } as any,
      })
      toast.success('Usuário atualizado com sucesso.')
      setEditing(false)
    } catch (err: any) {
      const msg = err?.response?.data?.message
      toast.error(Array.isArray(msg) ? msg[0] : msg || 'Erro ao atualizar usuário.')
    }
  }

  const handleOpenChange = (v: boolean) => {
    if (!v) {
      setEditing(false)
      reset()
      onClose()
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="flex flex-col p-0 w-full sm:max-w-md">
        <SheetHeader className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-500" />
            <SheetTitle>{editing ? 'Editar Usuário' : 'Detalhes do Usuário'}</SheetTitle>
          </div>
          <SheetDescription>
            {editing ? 'Altere os dados e salve.' : 'Informações completas do usuário selecionado'}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              Carregando...
            </div>
          ) : !user ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              Usuário não encontrado.
            </div>
          ) : editing ? (
            <form id="edit-user-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  placeholder="Nome completo"
                  {...register('name')}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="email@exemplo.com"
                  {...register('email')}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Perfil</Label>
                <Controller
                  name="profile_id"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Administrador</SelectItem>
                        <SelectItem value="2">Vendedor</SelectItem>
                        <SelectItem value="3">Cliente</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.profile_id && <p className="text-xs text-red-500">{errors.profile_id.message}</p>}
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-lg">
                    {user.name?.charAt(0)?.toUpperCase() ?? '?'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user.name ?? '-'}</p>
                  <p className="text-sm text-gray-500">{user.email ?? '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="ID" value={`#${user.id}`} />
                <InfoItem label="Perfil" value={profileNames[user.profile_id] ?? '-'} />
                <InfoItem label="Telefone" value={(user as any).phone ?? '-'} />
                <InfoItem
                  label="Status"
                  value={
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${user.status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.status === 1 ? 'Ativo' : 'Inativo'}
                    </span>
                  }
                />
                {user.created_at && (
                  <InfoItem
                    label="Cadastrado em"
                    value={format(new Date(user.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {!isLoading && user && (
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
            {editing ? (
              <>
                <Button variant="outline" size="sm" onClick={cancelEdit} disabled={updateUser.isPending}>
                  <X className="w-4 h-4 mr-1.5" />
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  type="submit"
                  form="edit-user-form"
                  disabled={!isValid || updateUser.isPending}
                >
                  <Check className="w-4 h-4 mr-1.5" />
                  {updateUser.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={startEdit}>
                <Pencil className="w-4 h-4 mr-1.5" />
                Editar
              </Button>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

function InfoItem({
  label,
  value,
  className,
}: {
  label: string
  value: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  )
}
