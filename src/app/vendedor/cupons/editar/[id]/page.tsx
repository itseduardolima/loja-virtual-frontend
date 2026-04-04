"use client";

import React from "react";
import { Controller } from "react-hook-form";

function clampInput(
  e: React.FormEvent<HTMLInputElement>,
  max: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setVal: (name: any, value: number) => void,
  field: string,
) {
  const input = e.currentTarget;
  const num = parseFloat(input.value);
  if (!isNaN(num) && num > max) {
    input.value = String(max);
    setVal(field, max);
  }
}
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Button,
  Input,
  Label,
  Card,
  LoadingSpinner,
  ErrorState,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tag, ChevronLeft, X, CalendarIcon } from "lucide-react";
import LoadingPage from "@/components/Layout/LoadingPage";
import { cn } from "@/lib/utils";
import { useEditCouponPage } from "./useEditCouponPage";

export default function EditarCupomPage() {
  const {
    user,
    authLoading,
    coupon,
    isFetching,
    fetchError,
    register,
    handleSubmit,
    errors,
    control,
    watch,
    setValue,
    onSubmit,
    isUpdating,
    handleCancel,
  } = useEditCouponPage();

  const selectedType = watch("type");

  const minOrderReg = register("min_order", {
    setValueAs: (v) => {
      if (!v && v !== 0) return undefined;
      const num = parseFloat(String(v).replace(",", "."));
      return isNaN(num) ? undefined : num;
    },
  });

  const handleMinOrderBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(",", ".");
    const num = parseFloat(raw);
    if (!isNaN(num) && num >= 0) {
      const clamped = Math.min(num, 99999);
      e.target.value = clamped.toFixed(2).replace(".", ",");
      setValue("min_order", clamped);
    } else {
      e.target.value = "";
      setValue("min_order", undefined as any);
    }
    minOrderReg.onBlur(e);
  };

  const handleMinOrderFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(",", ".");
    const num = parseFloat(raw);
    if (!isNaN(num)) e.target.value = String(num);
  };

  if (authLoading || isFetching) return <LoadingPage />;
  if (!user) return null;
  if (fetchError)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorState message="Erro ao carregar cupom" />
      </div>
    );
  if (!coupon)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorState message="Cupom não encontrado" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8">
        <Button variant="ghost" onClick={handleCancel} className="mb-6 -ml-5">
          <ChevronLeft className="h-5 w-5 mr-2" />
          Voltar
        </Button>

        <Card className="p-8 bg-white border-gray-200 shadow-sm">
          {/* Cabeçalho */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Tag className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Editar Cupom</h2>
              <p className="text-sm text-gray-500">
                Código:{" "}
                <span className="font-mono font-bold text-gray-700">
                  {coupon.code}
                </span>
                {" · "}
                <span className="text-gray-400">
                  {coupon.used_count} uso(s)
                </span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Tipo + Valor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Tipo de Desconto *
                </Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12 border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percent">Percentual (%)</SelectItem>
                        <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.type.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="value"
                  className="text-sm font-semibold text-gray-700 mb-2 block"
                >
                  {selectedType === "percent"
                    ? "Percentual (%) *"
                    : "Valor do Desconto (R$) *"}
                </Label>
                <div
                  className={cn(
                    "flex h-12 rounded-md border overflow-hidden transition-colors focus-within:ring-1 focus-within:ring-ring",
                    errors.value ? "border-red-500" : "border-gray-200",
                  )}
                >
                  {selectedType === "fixed" && (
                    <span className="flex items-center px-3 bg-gray-50 border-r text-sm text-gray-500 select-none">
                      R$
                    </span>
                  )}
                  <input
                    id="value"
                    type="number"
                    min={selectedType === "percent" ? "1" : "0.01"}
                    step={selectedType === "percent" ? "1" : "0.01"}
                    max={selectedType === "percent" ? 100 : undefined}
                    {...register("value")}
                    onInput={(e) =>
                      selectedType === "percent" &&
                      clampInput(e, 100, setValue, "value")
                    }
                    placeholder={
                      selectedType === "percent" ? "10" : "0,00"
                    }
                    className="flex-1 min-w-0 px-3 bg-transparent text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  {selectedType === "percent" && (
                    <span className="flex items-center px-3 bg-gray-50 border-l text-sm text-gray-500 select-none">
                      %
                    </span>
                  )}
                </div>
                {errors.value ? (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.value.message}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 mt-1">
                    {selectedType === "percent"
                      ? "Entre 1% e 100%"
                      : "Valor em reais, maior que R$ 0"}
                  </p>
                )}
              </div>
            </div>

            {/* Pedido mínimo + Limite de usos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="min_order"
                  className="text-sm font-semibold text-gray-700 mb-2 block"
                >
                  Pedido Mínimo (R$)
                </Label>
                <div
                  className={cn(
                    "flex h-12 rounded-md border overflow-hidden transition-colors focus-within:ring-1 focus-within:ring-ring",
                    errors.min_order ? "border-red-500" : "border-gray-200",
                  )}
                >
                  <span className="flex items-center px-3 bg-gray-50 border-r text-sm text-gray-500 select-none">
                    R$
                  </span>
                  <input
                    id="min_order"
                    type="text"
                    inputMode="decimal"
                    {...minOrderReg}
                    onBlur={handleMinOrderBlur}
                    onFocus={handleMinOrderFocus}
                    placeholder="0,00"
                    className="flex-1 min-w-0 px-3 bg-transparent text-sm outline-none"
                  />
                </div>
                {errors.min_order ? (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.min_order.message}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 mt-1">
                    Entre R$ 0 e R$ 99.999 · deixe em branco para sem restrição
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="max_uses"
                  className="text-sm font-semibold text-gray-700 mb-2 block"
                >
                  Limite de Usos
                </Label>
                <Input
                  id="max_uses"
                  type="number"
                  min="1"
                  max="999"
                  step="1"
                  {...register("max_uses")}
                  onInput={(e) => clampInput(e, 999, setValue, "max_uses")}
                  placeholder="Ilimitado"
                  className={cn(
                    "h-12",
                    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                    errors.max_uses
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200",
                    "transition-colors",
                  )}
                />
                {errors.max_uses ? (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.max_uses.message}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 mt-1">
                    Entre 1 e 999 · apenas inteiros · deixe em branco para ilimitado
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* Data de expiração */}
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Data de Expiração
                </Label>
                <Controller
                  name="expires_at"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full h-12 justify-start rounded-xl",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                          {field.value
                            ? format(
                                field.value as Date,
                                "dd 'de' MMMM 'de' yyyy",
                                { locale: ptBR },
                              )
                            : "Sem data de expiração"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value as Date | undefined}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          locale={ptBR}
                          initialFocus
                        />
                        {field.value && (
                          <div className="px-3 pb-3">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="w-full text-xs text-gray-500"
                              onClick={() => field.onChange(undefined)}
                            >
                              Remover data
                            </Button>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                  )}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Deixe sem data para o cupom não expirar
                </p>
              </div>
            </div>

            {/* Ações */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="px-6"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isUpdating} className="px-6">
                {isUpdating ? <LoadingSpinner size="sm" /> : "Atualizar Cupom"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
