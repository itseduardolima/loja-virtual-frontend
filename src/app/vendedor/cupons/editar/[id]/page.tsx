'use client'

import { LoadingPage } from '@/components/Layout'
import { ErrorState } from '@/components'
import { CouponForm } from '../../_components/CouponForm'
import { useEditCouponPage } from './useEditCouponPage'

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
  } = useEditCouponPage()

  if (authLoading || isFetching) return <LoadingPage />
  if (!user) return null
  if (fetchError) return <ErrorState message="Erro ao carregar cupom" />
  if (!coupon) return <ErrorState message="Cupom não encontrado" />

  return (
    <CouponForm
      mode="edit"
      couponCode={coupon.code}
      usedCount={coupon.used_count}
      register={register}
      control={control}
      watch={watch}
      setValue={setValue}
      errors={errors}
      isSubmitting={isUpdating}
      onSubmit={handleSubmit(onSubmit)}
      onCancel={handleCancel}
    />
  )
}
