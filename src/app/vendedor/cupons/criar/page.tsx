'use client'

import { LoadingPage } from '@/components/Layout'
import { CouponForm } from '../_components/CouponForm'
import { useCreateCouponPage } from './useCreateCouponPage'

export default function CriarCupomPage() {
  const {
    user,
    authLoading,
    register,
    handleSubmit,
    errors,
    control,
    watch,
    setValue,
    onSubmit,
    isCreating,
    handleCancel,
  } = useCreateCouponPage()

  if (authLoading) return <LoadingPage />
  if (!user) return <LoadingPage />

  return (
    <CouponForm
      mode="create"
      register={register}
      control={control}
      watch={watch}
      setValue={setValue}
      errors={errors}
      isSubmitting={isCreating}
      onSubmit={handleSubmit(onSubmit)}
      onCancel={handleCancel}
    />
  )
}
