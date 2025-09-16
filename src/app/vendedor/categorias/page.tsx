'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button, Input, Label, Textarea, Card, Badge, LoadingSpinner, ErrorState, CategoryFilters, Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, ConfirmDialog, Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components'
import { Plus, Edit, Trash2, ArrowLeft, X, Tag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCategoriesPage } from './useCategoriesPage'

export default function CategoriesPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const {
    isCreating,
    editingCategory,
    filters,
        categories,
    isLoading,
    error,
    meta,
    
    form,
    register,
    handleSubmit,
    errors,
    reset,
    setValue,
    
    onSubmit,
    handleEdit,
    handleDelete,
    cancelForm,
    setIsCreating,
    
    handlePageChange,
    handleSearchChange,
    setFilters,
    
    isCreatingCategory,
    isUpdating,
    isDeleting
  } = useCategoriesPage()

  if (authLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <ErrorState message="Você precisa estar logado para gerenciar categorias" />
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorState message="Erro ao carregar categorias" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Estilizado */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                className='flex gap-2'
                onClick={() => router.back()}
                
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </div>
            <Button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2  px-6 py-2 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Nova Categoria
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Categorias</h1>
          <p className="text-gray-600">Gerencie as categorias dos seus produtos</p>
        </div>

        {/* Filtros */}
        <div className="mb-8">
          <CategoryFilters
            filters={filters}
            setFilters={setFilters}
            onSearchChange={handleSearchChange}
            isSearching={isLoading}
          />
        </div>

        {/* Formulário de Criação/Edição */}
        {isCreating && (
          <Card className="p-8 mb-8 bg-white border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Tag className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                </h2>
                <p className="text-sm text-gray-500">
                  {editingCategory ? 'Atualize os dados da categoria' : 'Crie uma nova categoria para seus produtos'}
                </p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Nome da Categoria *
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Ex: Roupas Femininas"
                  className={`h-12 ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Descreva a categoria..."
                  rows={3}
                  className={`${errors.description ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors resize-none`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={cancelForm} className="px-6">
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isCreatingCategory || isUpdating}
                  className="px-6"
                >
                  {(isCreatingCategory || isUpdating) ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {editingCategory ? 'Atualizar' : 'Criar'} Categoria
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Lista de Categorias em Tabela */}
        <Card className="overflow-hidden bg-white border-gray-200 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Nome</TableHead>
                <TableHead className="w-[400px]">Descrição</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[100px]">Produtos</TableHead>
                <TableHead className="w-[150px]">Criado em</TableHead>
                <TableHead className="w-[100px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(categories) && categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    <div className="text-sm font-semibold text-gray-900">
                      {category.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900 max-w-xs">
                      {category.description ? (
                        <span className="line-clamp-2">{category.description}</span>
                      ) : (
                        <span className="text-gray-400 italic">Sem descrição</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={category.status === 1 ? "default" : "secondary"}
                      className={`text-xs ${category.status === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {category.status === 1 ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-900">
                    {category._count?.products || 0}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(category.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(category)}
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                        disabled={isDeleting}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Estado Vazio */}
        {(!Array.isArray(categories) || categories.length === 0) && !isLoading && (
          <div className="text-center py-16">
            <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Tag className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma categoria encontrada
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {filters.search ? 'Tente ajustar os filtros de busca' : 'Comece criando sua primeira categoria para organizar seus produtos'}
            </p>
            {!filters.search && (
              <Button 
                onClick={() => setIsCreating(true)}
                className="px-6 py-3"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Categoria
              </Button>
            )}
          </div>
        )}

        {/* Paginação */}
        {meta && meta.total > 0 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                {meta.prev && (
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(meta.currentPage - 1)}
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                )}
                
                {Array.from({ length: meta.lastPage }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={page === meta.currentPage}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                {meta.next && (
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(meta.currentPage + 1)}
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}
