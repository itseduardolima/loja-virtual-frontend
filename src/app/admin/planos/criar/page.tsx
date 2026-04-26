'use client'

import { CreditCard, Settings, Tag, ChevronLeft, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCriarPlanoPage } from './useCriarPlanoPage'

const FEATURE_OPTIONS = [
  {
    key: 'feature_coupons' as const,
    title: 'Cupons de desconto',
    description: 'Criar cupons percentuais ou fixos com expiração e limite de uso',
  },
  {
    key: 'feature_bling_integration' as const,
    title: 'Integração Bling ERP',
    description: 'Sincronizar pedidos automaticamente com o Bling',
  },
  {
    key: 'feature_product_questions' as const,
    title: 'Perguntas e respostas',
    description: 'Receber e responder perguntas dos clientes nos produtos',
  },
  {
    key: 'feature_advanced_dashboard' as const,
    title: 'Dashboard avançado',
    description: 'Gráfico de receita, top produtos, top categorias e estoque baixo',
  },
  {
    key: 'feature_order_export' as const,
    title: 'Exportar pedidos',
    description: 'Exportar pedidos em planilha Excel',
  },
]

export default function AdminCriarPlanoPage() {
  const { register, handleSubmit, setValue, watch, errors, isSubmitting, onSubmit, router } = useCriarPlanoPage()

  return (
    <div className="max-w-[1380px] mx-auto sm:py-4 md:py-6 lg:py-8 space-y-3 sm:space-y-4 md:space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="shrink-0">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Criar Plano</h1>
          <p className="text-gray-600 mt-1">Preencha as informações para criar um novo plano de assinatura</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
                  <Tag className="h-4 w-4 text-gray-500" />
                  Identificação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Nome *</Label>
                  <Input {...register('name')} placeholder="Ex: Plano Premium" />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Descrição</Label>
                  <Textarea
                    {...register('description')}
                    placeholder="Descreva o que está incluído neste plano..."
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  Cobrança
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Preço Mensal (R$) *</Label>
                    <Input {...register('price_monthly')} type="number" step="0.01" placeholder="29.90" />
                    {errors.price_monthly && <p className="text-xs text-red-500">{errors.price_monthly.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Preço Anual (R$)</Label>
                    <Input {...register('price_yearly')} type="number" step="0.01" placeholder="Vazio = não oferece anual" />
                    <p className="text-xs text-gray-400">Sugestão: ~17% de desconto (2 meses grátis)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
                  <Sparkles className="h-4 w-4 text-gray-500" />
                  Funcionalidades inclusas
                </CardTitle>
                <p className="text-sm text-gray-500">Selecione quais recursos premium este plano libera</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {FEATURE_OPTIONS.map((opt) => (
                  <div key={opt.key} className="flex items-start justify-between gap-4 p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{opt.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{opt.description}</p>
                    </div>
                    <Switch
                      checked={!!watch(opt.key)}
                      onCheckedChange={(checked) => setValue(opt.key, checked, { shouldDirty: true })}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>

          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
                  <Settings className="h-4 w-4 text-gray-500" />
                  Configurações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <Select defaultValue="1" onValueChange={(v) => setValue('status', Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Ativo</SelectItem>
                      <SelectItem value="0">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Máximo de Produtos</Label>
                  <Input {...register('max_products')} type="number" placeholder="Vazio = ilimitado" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Dias de Trial</Label>
                  <Input {...register('trial_days')} type="number" min={0} placeholder="Vazio = sem trial" />
                  <p className="text-xs text-gray-400">Acesso gratuito sem cartão por N dias</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Ordem de Exibição</Label>
                  <Input {...register('sort_order')} type="number" defaultValue={0} />
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Criando...' : 'Criar Plano'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} className="w-full">
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
