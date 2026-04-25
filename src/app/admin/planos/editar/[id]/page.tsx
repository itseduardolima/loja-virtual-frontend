"use client";

import { ChevronLeft, CreditCard, Settings, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEditarPlanoPage } from "./useEditarPlanoPage";

export default function AdminEditarPlanoPage() {
  const { plan, register, handleSubmit, setValue, errors, isSubmitting, onSubmit, router } = useEditarPlanoPage()

  if (!plan)
    return <div className="text-center py-16 text-gray-400">Carregando...</div>;

  return (
    <div className="max-w-[1380px] mx-auto sm:py-4 md:py-6 lg:py-8 space-y-3 sm:space-y-4 md:space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="shrink-0 px-0 hover:bg-transparent text-base font-medium"
      >
        <ChevronLeft className="h-6 w-6 mr-2" />
        Voltar
      </Button>
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Plano</h1>
          <p className="text-gray-600 mt-1">
            Atualize as informações do plano{" "}
            <span className="font-medium text-gray-800">{plan.name}</span>
          </p>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Nome *</Label>
                    <Input {...register("name")} placeholder="Ex: Plano Premium" />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Slug *</Label>
                    <Input {...register("slug")} placeholder="ex: plano-premium" />
                    {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Descrição</Label>
                  <Textarea
                    {...register("description")}
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
                    <Label className="text-sm font-medium text-gray-700">Preço (R$) *</Label>
                    <Input {...register("price")} type="number" step="0.01" placeholder="29.90" />
                    {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Ciclo de Cobrança *</Label>
                    <Select
                      defaultValue={plan.billing_cycle}
                      onValueChange={(v) => setValue("billing_cycle", v as "monthly" | "yearly")}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Mensal</SelectItem>
                        <SelectItem value="yearly">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-gray-900">Funcionalidades</CardTitle>
                <p className="text-sm text-gray-500">Liste cada funcionalidade em uma linha separada</p>
              </CardHeader>
              <CardContent>
                <Textarea
                  {...register("features")}
                  placeholder={"Produtos ilimitados\n1 loja\nDashboard de vendas\nSuporte prioritário"}
                  rows={6}
                  className="resize-none font-mono text-sm"
                />
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
                  <Select
                    defaultValue={String(plan.status)}
                    onValueChange={(v) => setValue("status", Number(v))}
                  >
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
                  <Input {...register("max_products")} type="number" placeholder="Vazio = ilimitado" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Máximo de Lojas</Label>
                  <Input {...register("max_stores")} type="number" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Ordem de Exibição</Label>
                  <Input {...register("sort_order")} type="number" />
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} className="w-full">
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
