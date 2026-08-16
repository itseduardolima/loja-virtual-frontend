'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { LoadingPage } from '@/components/Layout'
import { useCheckoutPage } from './useCheckoutPage'
import { storeAccentStyle } from '@/lib/storefront'
import { CheckoutHeader } from './_components/CheckoutHeader'
import { CheckoutMobileBar } from './_components/CheckoutMobileBar'
import { WhatsAppFlowBanner } from './_components/WhatsAppFlowBanner'
import { CustomerDataSection } from './_components/CustomerDataSection'
import { AddressSection } from './_components/AddressSection'
import { CouponSection } from './_components/CouponSection'
import { OrderSummary } from './_components/OrderSummary'

export default function CheckoutPage() {
  const {
    slug,
    storeInfo,
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
    dadosDone,
    addrDone,
    isCheckoutLoading,
    handleSubmit,
    handleSaveAndSelectAddress,
  } = useCheckoutPage()

  // Early-return: carregando loja ou carrinho
  if (storeLoading || isLoadingCart) {
    return <LoadingPage />
  }

  // Early-return: carrinho vazio
  if (!hasItems) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-nxbg px-4">
        <ShoppingBag size={48} className="text-nxi3" />
        <h2 className="text-xl font-bold text-nxi1">Carrinho vazio</h2>
        <p className="text-[14px] text-nxi2">Adicione produtos antes de finalizar o pedido</p>
        <Link
          href={'/loja/' + slug}
          className="h-11 rounded-full bg-nxp px-6 text-[14px] font-bold text-white flex items-center transition-opacity hover:opacity-90"
        >
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const bagCount = cartItems.reduce((s, i) => s + i.quantity, 0)
  const storeName = storeInfo?.name ?? ''

  return (
    <div className="min-h-screen bg-nxbg pb-24 lg:pb-0" style={storeAccentStyle(storeInfo)}>
      <CheckoutHeader slug={slug} bagCount={bagCount} storeName={storeName} />

      <div className="mx-auto max-w-[1080px] px-4 py-6 md:px-8">
        <WhatsAppFlowBanner storeName={storeName} />

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
            {/* Coluna esquerda: seções do formulário + espinha ligando as etapas */}
            <div className="relative flex flex-col gap-5">
              <div
                aria-hidden="true"
                className="absolute bottom-10 left-[38px] top-10 w-0.5 bg-nxborder"
              />
              <CustomerDataSection
                formData={formData}
                errors={errors}
                dadosDone={dadosDone}
                handleInput={handleInput}
              />

              <AddressSection
                isAuthenticated={isAuthenticated}
                addresses={addresses}
                addressesLoading={addressesLoading}
                selectedAddressId={selectedAddressId}
                setSelectedAddressId={setSelectedAddressId}
                useManualAddress={useManualAddress}
                setUseManualAddress={setUseManualAddress}
                showAddressForm={showAddressForm}
                setShowAddressForm={setShowAddressForm}
                addressForm={addressForm}
                setAddressForm={setAddressForm}
                isFetchingCep={isFetchingCep}
                cepError={cepError}
                addressError={addressError}
                addrDone={addrDone}
                handleZipcodeChange={handleZipcodeChange}
                handleSaveAndSelectAddress={handleSaveAndSelectAddress}
                isCreating={isCreating}
              />

              <CouponSection
                couponInput={couponInput}
                setCouponInput={setCouponInput}
                couponResult={couponResult}
                couponError={couponError}
                setCouponError={setCouponError}
                isValidatingCoupon={isValidatingCoupon}
                handleValidateCoupon={handleValidateCoupon}
                handleRemoveCoupon={handleRemoveCoupon}
              />
            </div>

            {/* Coluna direita: resumo do pedido (sticky) */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <OrderSummary
                cartItems={cartItems}
                totalPrice={totalPrice}
                finalTotal={finalTotal}
                couponResult={couponResult}
                isCheckoutLoading={isCheckoutLoading}
                storeName={storeName}
              />
            </div>
          </div>

          <CheckoutMobileBar finalTotal={finalTotal} isCheckoutLoading={isCheckoutLoading} />
        </form>
      </div>
    </div>
  )
}
