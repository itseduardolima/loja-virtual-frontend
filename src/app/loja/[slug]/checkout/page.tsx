"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { buildImageUrl, formatPrice } from "@/lib/utils";
import {
  ArrowLeft,
  Tag,
  MapPin,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  ShoppingBag,
  ChevronLeft,
} from "lucide-react";
import { useCheckoutPage, emptyAddressForm } from "./useCheckoutPage";

export default function CheckoutPage() {
  const {
    slug,
    storeLoading,
    cartItems,
    totalPrice,
    isLoadingCart,
    isAuthenticated,
    addresses,
    addressesLoading,
    isCreating,
    addressError,
    isFetchingCep,
    cepError,
    handleZipcodeChange,
    selectedAddressId,
    setSelectedAddressId,
    showAddressForm,
    setShowAddressForm,
    addressForm,
    setAddressForm,
    useManualAddress,
    setUseManualAddress,
    showAddresses,
    setShowAddresses,
    formData,
    errors,
    handleInput,
    couponInput,
    setCouponInput,
    couponResult,
    couponError,
    setCouponError,
    isValidatingCoupon,
    handleValidateCoupon,
    handleRemoveCoupon,
    hasItems,
    finalTotal,
    isCheckoutLoading,
    handleSubmit,
    handleSaveAndSelectAddress,
    focusedField,
    setFocusedField,
  } = useCheckoutPage();

  if (storeLoading || isLoadingCart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasItems) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Carrinho vazio
          </h2>
          <p className="text-gray-600 mb-4">
            Adicione produtos antes de finalizar o pedido
          </p>
          <Link href={`/loja/${slug}`}>
            <Button>Voltar para a loja</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link
            href={`/loja/${slug}`}
            className="text-gray-500 hover:text-gray-800"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Finalizar Pedido</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left column: form */}
          <div className="lg:col-span-3 space-y-5">
            {/* Dados do cliente */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-bold text-gray-900 mb-4">Seus dados</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customer_name">Nome completo *</Label>
                  <Input
                    id="customer_name"
                    value={formData.customer_name}
                    onChange={(e) =>
                      handleInput("customer_name", e.target.value.slice(0, 100))
                    }
                    onFocus={() => setFocusedField("customer_name")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Seu nome completo"
                    maxLength={100}
                    className={errors.customer_name ? "border-red-500" : ""}
                  />
                  {errors.customer_name ? (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.customer_name}
                    </p>
                  ) : focusedField === "customer_name" && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formData.customer_name.length}/100
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="customer_email">E-mail *</Label>
                  <Input
                    id="customer_email"
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) =>
                      handleInput("customer_email", e.target.value.slice(0, 100))
                    }
                    onFocus={() => setFocusedField("customer_email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="seu@email.com"
                    maxLength={100}
                    className={errors.customer_email ? "border-red-500" : ""}
                  />
                  {errors.customer_email ? (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.customer_email}
                    </p>
                  ) : focusedField === "customer_email" && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formData.customer_email.length}/100
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="customer_phone">WhatsApp *</Label>
                  <Input
                    id="customer_phone"
                    type="tel"
                    value={formData.customer_phone}
                    onChange={(e) =>
                      handleInput("customer_phone", e.target.value)
                    }
                    placeholder="(11) 99999-9999"
                    className={errors.customer_phone ? "border-red-500" : ""}
                  />
                  {errors.customer_phone && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.customer_phone}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="customer_document">CPF/CNPJ *</Label>
                  <Input
                    id="customer_document"
                    type="text"
                    value={formData.customer_document}
                    onChange={(e) =>
                      handleInput("customer_document", e.target.value.replace(/\D/g, '').slice(0, 14))
                    }
                    placeholder="000.000.000-00"
                    className={errors.customer_document ? "border-red-500" : ""}
                  />
                  {errors.customer_document && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.customer_document}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="notes">Observações (opcional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInput("notes", e.target.value.slice(0, 230))}
                    onFocus={() => setFocusedField("notes")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Alguma observação sobre o pedido?"
                    rows={3}
                    maxLength={230}
                    className="resize-none"
                  />
                  <p className={`text-xs mt-0.5 ${formData.notes.length >= 210 ? 'text-orange-500' : 'text-gray-400'}`}>
                    {formData.notes.length}/230
                  </p>
                </div>
              </div>
            </div>

            {/* Endereço de entrega */}
            <div
              className={`bg-white rounded-xl border p-5 ${addressError ? "border-red-400" : "border-gray-200"}`}
            >
              <button
                type="button"
                className="w-full flex items-center justify-between"
                onClick={() => setShowAddresses((v) => !v)}
              >
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  Endereço de entrega *
                </h2>
                {showAddresses ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </button>

              {showAddresses && (
                <div className="mt-4 space-y-3">
                  {isAuthenticated &&
                    !addressesLoading &&
                    addresses.length > 0 && (
                      <div className="space-y-2">
                        {addresses.map((addr) => (
                          <button
                            key={addr.id}
                            type="button"
                            onClick={() => {
                              setSelectedAddressId(addr.id);
                              setUseManualAddress(false);
                            }}
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${
                              selectedAddressId === addr.id && !useManualAddress
                                ? "border-gray-900 bg-gray-50"
                                : "border-gray-200 hover:border-gray-400"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                {addr.label && (
                                  <span className="text-xs font-semibold text-gray-500 uppercase">
                                    {addr.label} —{" "}
                                  </span>
                                )}
                                <span className="text-sm font-medium text-gray-900">
                                  {addr.name}
                                </span>
                                <p className="text-xs text-gray-600 mt-0.5">
                                  {addr.street}
                                  {addr.number ? `, ${addr.number}` : ""}
                                  {addr.complement
                                    ? ` - ${addr.complement}`
                                    : ""}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {addr.neighborhood
                                    ? `${addr.neighborhood}, `
                                    : ""}
                                  {addr.city} - {addr.state}, {addr.zipcode}
                                </p>
                              </div>
                              {selectedAddressId === addr.id &&
                                !useManualAddress && (
                                  <Check className="h-4 w-4 text-gray-900 mt-0.5 shrink-0" />
                                )}
                            </div>
                            {addr.is_default === 1 && (
                              <Badge variant="outline" className="text-xs mt-1">
                                Padrão
                              </Badge>
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                  {/* Add new address */}
                  {isAuthenticated && !showAddressForm && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setShowAddressForm(true);
                        setUseManualAddress(false);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Novo endereço
                    </Button>
                  )}

                  {/* Non-authenticated: show simple manual address */}
                  {!isAuthenticated && (
                    <div>
                      <button
                        type="button"
                        onClick={() => setUseManualAddress((v) => !v)}
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <MapPin className="h-3 w-3" />
                        {useManualAddress
                          ? "Ocultar campos de endereço"
                          : "Informar endereço de entrega"}
                      </button>
                    </div>
                  )}

                  {/* Address form (save for logged-in users or manual for guests) */}
                  {(showAddressForm ||
                    (!isAuthenticated && useManualAddress)) && (
                    <div className=" p-2 space-y-3">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {isAuthenticated
                          ? "Novo endereço"
                          : "Endereço de entrega"}
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {/* CEP — primeiro campo */}
                        <div className="col-span-2 sm:col-span-1">
                          <Label className="text-xs">CEP *</Label>
                          <div className="relative">
                            <Input
                              value={addressForm.zipcode}
                              onChange={(e) => handleZipcodeChange(e.target.value)}
                              onFocus={() => setFocusedField("zipcode")}
                              onBlur={() => setFocusedField(null)}
                              placeholder="00000-000"
                              maxLength={9}
                              className={`h-11 text-sm rounded-xl pr-8 ${cepError ? "border-red-400" : ""}`}
                            />
                            {isFetchingCep && (
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                            )}
                          </div>
                          {cepError ? (
                            <p className="text-xs text-red-500 mt-0.5">{cepError}</p>
                          ) : focusedField === "zipcode" && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {addressForm.zipcode.length}/9
                              {addressForm.zipcode.replace(/\D/g, "").length === 8 && !isFetchingCep && (
                                <span className="ml-1 text-green-600">✓</span>
                              )}
                            </p>
                          )}
                        </div>

                        {/* Rótulo (somente autenticados) */}
                        {isAuthenticated && (
                          <div className="col-span-2 sm:col-span-1">
                            <Label className="text-xs">
                              Rótulo (ex: Casa, Trabalho)
                            </Label>
                            <Input
                              value={addressForm.label}
                              onChange={(e) =>
                                setAddressForm((p) => ({
                                  ...p,
                                  label: e.target.value.slice(0, 30),
                                }))
                              }
                              onFocus={() => setFocusedField("label")}
                              onBlur={() => setFocusedField(null)}
                              placeholder="Casa"
                              maxLength={30}
                              className="h-11 text-sm rounded-xl"
                            />
                            {focusedField === "label" && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {addressForm.label.length}/30
                              </p>
                            )}
                          </div>
                        )}

                        {/* Nome do destinatário */}
                        <div className="col-span-2">
                          <Label className="text-xs">
                            Nome do destinatário *
                          </Label>
                          <Input
                            value={addressForm.name}
                            onChange={(e) =>
                              setAddressForm((p) => ({
                                ...p,
                                name: e.target.value.slice(0, 80),
                              }))
                            }
                            onFocus={() => setFocusedField("name")}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Nome completo"
                            maxLength={80}
                            className="h-11 text-sm rounded-xl"
                          />
                          {focusedField === "name" && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {addressForm.name.length}/80
                            </p>
                          )}
                        </div>

                        {/* Logradouro */}
                        <div className="col-span-2">
                          <Label className="text-xs">Logradouro *</Label>
                          <Input
                            value={addressForm.street}
                            onChange={(e) =>
                              setAddressForm((p) => ({
                                ...p,
                                street: e.target.value.slice(0, 100),
                              }))
                            }
                            onFocus={() => setFocusedField("street")}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Rua, Avenida..."
                            maxLength={100}
                            className="h-11 text-sm rounded-xl"
                          />
                          {focusedField === "street" && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {addressForm.street.length}/100
                            </p>
                          )}
                        </div>

                        {/* Número */}
                        <div>
                          <Label className="text-xs">Número</Label>
                          <Input
                            value={addressForm.number}
                            onChange={(e) =>
                              setAddressForm((p) => ({
                                ...p,
                                number: e.target.value.slice(0, 10),
                              }))
                            }
                            onFocus={() => setFocusedField("number")}
                            onBlur={() => setFocusedField(null)}
                            placeholder="123"
                            maxLength={10}
                            className="h-11 text-sm rounded-xl"
                          />
                          {focusedField === "number" && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {addressForm.number.length}/10
                            </p>
                          )}
                        </div>

                        {/* Complemento */}
                        <div>
                          <Label className="text-xs">Complemento</Label>
                          <Input
                            value={addressForm.complement}
                            onChange={(e) =>
                              setAddressForm((p) => ({
                                ...p,
                                complement: e.target.value.slice(0, 50),
                              }))
                            }
                            onFocus={() => setFocusedField("complement")}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Apto 4"
                            maxLength={50}
                            className="h-11 text-sm rounded-xl"
                          />
                          {focusedField === "complement" && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {addressForm.complement.length}/50
                            </p>
                          )}
                        </div>

                        {/* Bairro */}
                        <div className="col-span-2">
                          <Label className="text-xs">Bairro</Label>
                          <Input
                            value={addressForm.neighborhood}
                            onChange={(e) =>
                              setAddressForm((p) => ({
                                ...p,
                                neighborhood: e.target.value.slice(0, 60),
                              }))
                            }
                            onFocus={() => setFocusedField("neighborhood")}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Bairro"
                            maxLength={60}
                            className="h-11 text-sm rounded-xl"
                          />
                          {focusedField === "neighborhood" && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {addressForm.neighborhood.length}/60
                            </p>
                          )}
                        </div>

                        {/* Cidade */}
                        <div>
                          <Label className="text-xs">Cidade *</Label>
                          <Input
                            value={addressForm.city}
                            onChange={(e) =>
                              setAddressForm((p) => ({
                                ...p,
                                city: e.target.value.slice(0, 60),
                              }))
                            }
                            onFocus={() => setFocusedField("city")}
                            onBlur={() => setFocusedField(null)}
                            placeholder="São Paulo"
                            maxLength={60}
                            className="h-11 text-sm rounded-xl"
                          />
                          {focusedField === "city" && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {addressForm.city.length}/60
                            </p>
                          )}
                        </div>

                        {/* UF */}
                        <div>
                          <Label className="text-xs">UF *</Label>
                          <Input
                            value={addressForm.state}
                            onChange={(e) =>
                              setAddressForm((p) => ({
                                ...p,
                                state: e.target.value
                                  .toUpperCase()
                                  .slice(0, 2),
                              }))
                            }
                            onFocus={() => setFocusedField("state")}
                            onBlur={() => setFocusedField(null)}
                            placeholder="SP"
                            maxLength={2}
                            className="h-11 text-sm rounded-xl"
                          />
                          {focusedField === "state" && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {addressForm.state.length}/2
                            </p>
                          )}
                        </div>
                      </div>
                      {isAuthenticated && (
                        <div className="flex justify-end gap-2">

                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setShowAddressForm(false);
                              setAddressForm(emptyAddressForm);
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleSaveAndSelectAddress}
                            disabled={isCreating}
                          >
                            {isCreating ? "Salvando..." : "Salvar"}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {addressError && (
                <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                  <X className="h-3 w-3" />
                  {addressError}
                </p>
              )}
            </div>

            {/* Cupom de desconto */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-500" />
                Cupom de desconto
              </h2>

              {couponResult ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <div>
                    <span className="text-sm font-semibold text-green-800">
                      {couponResult.coupon_code}
                    </span>
                    <span className="text-xs text-green-700 ml-2">
                      {couponResult.type === "percent"
                        ? `${couponResult.value}% de desconto`
                        : `R$ ${couponResult.value.toFixed(2).replace(".", ",")} de desconto`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-green-700 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponError("");
                    }}
                    placeholder="Digite o código do cupom"
                    className="flex-1"
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleValidateCoupon())
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleValidateCoupon}
                    disabled={!couponInput.trim() || isValidatingCoupon}
                    className="rounded-xl h-12"
                  >
                    {isValidatingCoupon ? "..." : "Aplicar"}
                  </Button>
                </div>
              )}
              {couponError && (
                <p className="text-xs text-red-600 mt-1">{couponError}</p>
              )}
            </div>
          </div>

          {/* Right column: order summary */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-4">
              <h2 className="font-bold text-gray-900 mb-4">Resumo do pedido</h2>

              {/* Items */}
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => {
                  const images = item.product.images;
                  let imageUrl: string | null = null;
                  if (
                    images &&
                    typeof images === "object" &&
                    !Array.isArray(images)
                  ) {
                    const byColor = images as Record<string, string[]>;
                    const forColor = item.color ? byColor[item.color] : null;
                    if (Array.isArray(forColor) && forColor.length > 0)
                      imageUrl = forColor[0];
                    else {
                      const first = Object.keys(byColor)[0];
                      imageUrl = first ? (byColor[first]?.[0] ?? null) : null;
                    }
                  } else if (Array.isArray(images) && images.length > 0) {
                    imageUrl = images[0];
                  }

                  return (
                    <div key={item.id} className="flex gap-3 items-start">
                      <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        {imageUrl ? (
                          <Image
                            src={buildImageUrl(imageUrl)}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <ShoppingBag className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                          {item.product.name}
                        </p>
                        <div className="flex gap-1 mt-0.5">
                          {item.size && (
                            <Badge
                              variant="outline"
                              className="text-xs px-1 py-0"
                            >
                              {item.size}
                            </Badge>
                          )}
                          {item.color && (
                            <Badge
                              variant="outline"
                              className="text-xs px-1 py-0"
                            >
                              {item.color}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Qtd: {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 shrink-0">
                        {formatPrice(item.subtotal)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                {couponResult && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Desconto ({couponResult.coupon_code})</span>
                    <span>-{formatPrice(couponResult.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-100">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-4 h-12 text-base"
                disabled={
                  isCheckoutLoading ||
                  !formData.customer_name.trim() ||
                  !formData.customer_email.trim() ||
                  !formData.customer_phone.trim() ||
                  formData.customer_document.length < 11
                }
              >
                {isCheckoutLoading ? "Processando..." : "Finalizar Pedido"}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Após o pedido, você será redirecionado ao WhatsApp do vendedor
                para combinar pagamento e entrega.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
