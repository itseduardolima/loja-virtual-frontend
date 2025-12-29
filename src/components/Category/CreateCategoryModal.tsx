'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { createCategorySchema, CreateCategoryFormData } from '@/schemas'
import { useCategories } from '@/hooks/useCategories'
import { useToastContext } from '@/contexts/ToastContext'
import { Tag, X, Info } from 'lucide-react'

interface CreateCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onCategoryCreated: (categoryId: number) => void
}

export function CreateCategoryModal({ isOpen, onClose, onCategoryCreated }: CreateCategoryModalProps) {
  const { success, error: showError } = useToastContext()
  const [isCreating, setIsCreating] = useState(false)
  
  const { createCategory } = useCategories()

  const form = useForm<CreateCategoryFormData>({
    resolver: yupResolver(createCategorySchema) as any,
    defaultValues: {
      name: '',
      description: ''
    }
  })

  const { register, handleSubmit, formState: { errors }, reset } = form

  const onSubmit = async (data: CreateCategoryFormData) => {
    try {
      setIsCreating(true)
      createCategory({
        name: data.name,
        description: data.description
      }, {
        onSuccess: (response) => {
          success('Categoria criada com sucesso!', 'Sucesso')
          onCategoryCreated(response.data.id)
          reset()
          onClose()
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.message || 'Erro ao criar categoria'
          showError(errorMessage, 'Erro')
        }
      })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao criar categoria'
      showError(errorMessage, 'Erro')
    } finally {
      setIsCreating(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Tag className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">Nova Categoria</DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Crie uma categoria para organizar seus produtos
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Informação para vendedores leigos */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">O que são categorias?</p>
              <p className="text-blue-700">
                As categorias ajudam a organizar seus produtos. Por exemplo: &quot;Roupas&quot;, &quot;Eletrônicos&quot;, 
                &quot;Casa e Decoração&quot;. Isso facilita para os clientes encontrarem seus produtos.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-2 block">
              Nome da Categoria *
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Ex: Roupas Femininas"
              className={`h-11 ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <X className="h-3 w-3" />
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-2 block">
              Descrição (opcional)
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Descreva brevemente esta categoria..."
              rows={3}
              className={`resize-none ${errors.description ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <X className="h-3 w-3" />
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isCreating}
            >
              {isCreating ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
