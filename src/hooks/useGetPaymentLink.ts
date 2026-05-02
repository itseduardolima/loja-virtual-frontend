import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import toast from 'react-hot-toast'

interface PaymentLinkResponse {
  invoice_url: string | null
  bank_slip_url: string | null
  qr_code: string | null
  billing_type: string | null
  due_date: string | null
}

export function useGetPaymentLink() {
  return useMutation<PaymentLinkResponse, Error, string>({
    mutationFn: async (paymentId) => {
      const response = await api.get<PaymentLinkResponse>(
        `/subscriptions/payments/${paymentId}/link`,
      )
      return response.data
    },
    onSuccess: (data) => {
      const url = data.invoice_url || data.bank_slip_url
      if (url) {
        window.open(url, '_blank')
      } else {
        toast.error('Link de pagamento indisponível.')
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao buscar link de pagamento')
    },
  })
}
