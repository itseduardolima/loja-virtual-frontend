'use client'

import { useState } from 'react'
import { Printer, FileText, Tag as LabelIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { type Order } from '@/types/order'
import { formatDate, formatPrice } from '@/lib/utils'

interface OrderPrintModalProps {
  order: Order
  isOpen: boolean
  onClose: () => void
}

function parseAddress(raw: string | null): Record<string, string> | null {
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

function esc(str: string | null | undefined): string {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatPricePlain(value: string | number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(value.toString()))
}

function generateInvoiceHTML(order: Order): string {
  const addr = parseAddress(order.delivery_address)
  const storeName = order.store?.name ?? 'Loja'
  const hasDiscount = order.coupon_discount && parseFloat(order.coupon_discount) > 0
  const subtotal = hasDiscount
    ? parseFloat(order.total) + parseFloat(order.coupon_discount!)
    : parseFloat(order.total)

  const addrLines = addr
    ? [
        addr.street ? `${esc(addr.street)}${addr.number ? `, ${esc(addr.number)}` : ''}${addr.complement ? ` - ${esc(addr.complement)}` : ''}` : '',
        esc(addr.neighborhood),
        [addr.city, addr.state].filter(Boolean).map(esc).join(' - ') + (addr.zipcode ? ` - CEP: ${esc(addr.zipcode)}` : ''),
      ].filter(Boolean).join('<br>')
    : 'Endereço não informado pelo comprador'

  const itemsRows = order.items.map(item => {
    const lineTotal = parseFloat(item.price) * item.quantity
    const variants = [item.size, item.color].filter(Boolean).map(esc).join(' / ')
    return `
      <tr>
        <td style="padding:6px 4px;border-bottom:1px solid #e5e7eb;">${esc(item.product.name)}${variants ? `<br><span style="font-size:11px;color:#6b7280;">${variants}</span>` : ''}</td>
        <td style="padding:6px 4px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
        <td style="padding:6px 4px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatPricePlain(item.price)}</td>
        <td style="padding:6px 4px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600;">${formatPricePlain(lineTotal)}</td>
      </tr>`
  }).join('')

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Nota Fiscal - ${esc(order.order_code)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #111827; background: #fff; padding: 32px; max-width: 794px; margin: 0 auto; }
  @media print { body { padding: 16px; } @page { size: A4; margin: 12mm; } }
  .divider { border: none; border-top: 2px solid #111827; margin: 12px 0; }
  .divider-light { border: none; border-top: 1px solid #e5e7eb; margin: 10px 0; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #f3f4f6; padding: 8px 4px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #374151; }
  th:nth-child(2), th:nth-child(3), th:nth-child(4) { text-align: center; }
  th:nth-child(3), th:nth-child(4) { text-align: right; }
  .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; margin-bottom: 6px; }
  .total-row { display: flex; justify-content: space-between; padding: 3px 0; font-size: 13px; }
  .total-final { font-size: 16px; font-weight: 700; }
</style>
</head>
<body>
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;">
    <div>
      <div style="font-size:20px;font-weight:700;">${esc(storeName)}</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Nota Fiscal Simplificada</div>
      <div style="font-size:12px;color:#6b7280;margin-top:2px;">Pedido #${esc(order.order_code)}</div>
      <div style="font-size:12px;color:#6b7280;">${formatDate(order.created_at)}</div>
    </div>
  </div>
  <hr class="divider">

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:12px;">
    <div>
      <div class="section-title">Dados do Cliente</div>
      <div style="font-weight:600;">${esc(order.customer_name)}</div>
      ${order.customer_phone ? `<div style="color:#374151;">${esc(order.customer_phone)}</div>` : ''}
      ${order.customer_email ? `<div style="color:#374151;font-size:12px;">${esc(order.customer_email)}</div>` : ''}
    </div>
    <div>
      <div class="section-title">Endereço de Entrega</div>
      <div style="line-height:1.6;">${addrLines}</div>
    </div>
  </div>
  <hr class="divider-light">

  <table style="margin-bottom:12px;">
    <thead>
      <tr>
        <th style="width:55%;">Produto</th>
        <th style="width:10%;text-align:center;">Qtd</th>
        <th style="width:17.5%;text-align:right;">Unitário</th>
        <th style="width:17.5%;text-align:right;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemsRows}
    </tbody>
  </table>

  <div style="display:flex;justify-content:flex-end;">
    <div style="min-width:220px;">
      <hr class="divider-light">
      ${hasDiscount ? `
      <div class="total-row">
        <span style="color:#6b7280;">Subtotal</span>
        <span>${formatPricePlain(subtotal)}</span>
      </div>
      <div class="total-row">
        <span style="color:#059669;">Desconto (${esc(order.coupon_code ?? 'Cupom')})</span>
        <span style="color:#059669;">-${formatPricePlain(order.coupon_discount!)}</span>
      </div>
      <hr class="divider-light">
      ` : ''}
      <div class="total-row total-final">
        <span>Total</span>
        <span>${formatPricePlain(order.total)}</span>
      </div>
    </div>
  </div>

  ${order.notes ? `
  <hr class="divider-light" style="margin-top:16px;">
  <div style="margin-top:8px;">
    <div class="section-title">Observações</div>
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:4px;padding:8px;font-size:12px;color:#374151;">${esc(order.notes)}</div>
  </div>
  ` : ''}

  <div style="margin-top:24px;text-align:center;font-size:10px;color:#9ca3af;">
    Documento gerado em ${new Date().toLocaleDateString('pt-BR')} — Não possui valor fiscal
  </div>
</body>
</html>`
}

function generateLabelHTML(order: Order): string {
  const addr = parseAddress(order.delivery_address)
  const storeName = order.store?.name ?? 'Loja'

  const recipientName = addr?.name || order.customer_name
  const street = addr ? `${esc(addr.street)}${addr.number ? `, ${esc(addr.number)}` : ''}${addr.complement ? ` - ${esc(addr.complement)}` : ''}` : ''
  const neighborhood = esc(addr?.neighborhood)
  const cityState = addr ? [addr.city, addr.state].filter(Boolean).map(esc).join(' - ') : ''
  const zipcode = addr?.zipcode ? `CEP: ${esc(addr.zipcode)}` : ''

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Etiqueta - ${esc(order.order_code)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; background: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 16px; }
  @media print { body { padding: 0; min-height: auto; } @page { size: 10cm 15cm; margin: 6mm; } }
  .label { border: 3px solid #111827; border-radius: 8px; width: 100%; max-width: 380px; overflow: hidden; }
  .label-section { padding: 16px 20px; }
  .label-divider { border: none; border-top: 2px solid #111827; }
  .label-tag { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; margin-bottom: 8px; }
  .recipient-name { font-size: 20px; font-weight: 800; line-height: 1.2; margin-bottom: 8px; }
  .recipient-addr { font-size: 14px; line-height: 1.7; color: #1f2937; }
  .sender { font-size: 13px; color: #374151; }
  .ref { font-size: 12px; color: #6b7280; margin-top: 6px; font-family: monospace; }
</style>
</head>
<body>
  <div class="label">
    <div class="label-section">
      <div class="label-tag">Destinatário</div>
      <div class="recipient-name">${esc(recipientName)}</div>
      <div class="recipient-addr">
        ${street ? `${street}<br>` : ''}
        ${neighborhood ? `${neighborhood}<br>` : ''}
        ${cityState ? `${cityState}<br>` : ''}
        ${zipcode}
      </div>
    </div>
    <hr class="label-divider">
    <div class="label-section" style="background:#f9fafb;">
      <div class="label-tag">Remetente</div>
      <div class="sender" style="font-weight:700;">${esc(storeName)}</div>
      <div class="ref">Pedido: #${esc(order.order_code)}</div>
    </div>
  </div>
</body>
</html>`
}

export function OrderPrintModal({ order, isOpen, onClose }: OrderPrintModalProps) {
  const [activeTab, setActiveTab] = useState<'invoice' | 'label'>('invoice')

  const addr = parseAddress(order.delivery_address)
  const storeName = order.store?.name ?? 'Loja'
  const hasDiscount = order.coupon_discount && parseFloat(order.coupon_discount) > 0
  const subtotal = hasDiscount
    ? parseFloat(order.total) + parseFloat(order.coupon_discount!)
    : parseFloat(order.total)

  const handlePrint = () => {
    const html = activeTab === 'invoice'
      ? generateInvoiceHTML(order)
      : generateLabelHTML(order)
    const win = window.open('', '_blank', 'width=794,height=1123')
    if (!win) return
    win.document.write(html)
    win.document.close()
    setTimeout(() => { win.print() }, 400)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Imprimir pedido #{order.order_code}
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 pb-0">
          <button
            onClick={() => setActiveTab('invoice')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'invoice'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="h-4 w-4" />
            Nota Fiscal
          </button>
          <button
            onClick={() => setActiveTab('label')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'label'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <LabelIcon className="h-4 w-4" />
            Etiqueta de Envio
          </button>
        </div>

        {/* Preview */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'invoice' && (
            <div className="border border-gray-200 rounded-lg p-5 text-sm font-[Arial,sans-serif] bg-white">
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="font-bold text-xl">{storeName}</div>
                <div className="text-right">
                  <div className="font-bold uppercase tracking-wide text-sm">Nota Fiscal Simplificada</div>
                  <div className="text-xs text-gray-500 mt-0.5">Pedido #{order.order_code}</div>
                  <div className="text-xs text-gray-500">{formatDate(order.created_at)}</div>
                </div>
              </div>
              <hr className="border-gray-900 border-t-2 my-3" />

              {/* Cliente + Endereço */}
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Dados do Cliente</div>
                  <div className="font-semibold">{order.customer_name}</div>
                  {order.customer_phone && <div className="text-gray-600">{order.customer_phone}</div>}
                  {order.customer_email && <div className="text-gray-600 text-xs">{order.customer_email}</div>}
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Endereço de Entrega</div>
                  {addr ? (
                    <div className="text-gray-700 leading-relaxed text-xs">
                      {addr.street && <div>{addr.street}{addr.number ? `, ${addr.number}` : ''}{addr.complement ? ` - ${addr.complement}` : ''}</div>}
                      {addr.neighborhood && <div>{addr.neighborhood}</div>}
                      <div>{[addr.city, addr.state].filter(Boolean).join(' - ')}{addr.zipcode ? ` - ${addr.zipcode}` : ''}</div>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-xs">Não informado</div>
                  )}
                </div>
              </div>
              <hr className="border-gray-200 my-2" />

              {/* Itens */}
              <table className="w-full text-xs mb-3">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-1.5 px-1 text-left font-semibold text-gray-600 uppercase tracking-wide" style={{ width: '55%' }}>Produto</th>
                    <th className="py-1.5 px-1 text-center font-semibold text-gray-600 uppercase tracking-wide">Qtd</th>
                    <th className="py-1.5 px-1 text-right font-semibold text-gray-600 uppercase tracking-wide">Unitário</th>
                    <th className="py-1.5 px-1 text-right font-semibold text-gray-600 uppercase tracking-wide">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map(item => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-1.5 px-1">
                        <div>{item.product.name}</div>
                        {(item.size || item.color) && (
                          <div className="text-gray-400">{[item.size, item.color].filter(Boolean).join(' / ')}</div>
                        )}
                      </td>
                      <td className="py-1.5 px-1 text-center">{item.quantity}</td>
                      <td className="py-1.5 px-1 text-right">{formatPrice(parseFloat(item.price))}</td>
                      <td className="py-1.5 px-1 text-right font-semibold">{formatPrice(parseFloat(item.price) * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totais */}
              <div className="flex justify-end">
                <div className="min-w-[180px]">
                  <hr className="border-gray-200 mb-2" />
                  {hasDiscount && (
                    <>
                      <div className="flex justify-between text-xs text-gray-500 py-0.5">
                        <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-green-700 py-0.5">
                        <span>Desconto ({order.coupon_code})</span>
                        <span>-{formatPrice(parseFloat(order.coupon_discount!))}</span>
                      </div>
                      <hr className="border-gray-200 my-1" />
                    </>
                  )}
                  <div className="flex justify-between font-bold text-sm py-0.5">
                    <span>Total</span><span>{formatPrice(parseFloat(order.total))}</span>
                  </div>
                </div>
              </div>

              {order.notes && (
                <>
                  <hr className="border-gray-200 mt-3 mb-2" />
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Observações</div>
                  <div className="text-xs text-gray-600 bg-gray-50 rounded p-2">{order.notes}</div>
                </>
              )}
            </div>
          )}

          {activeTab === 'label' && (
            <div className="flex justify-center py-4">
              <div className="border-2 border-gray-900 rounded-lg overflow-hidden w-full max-w-sm font-[Arial,sans-serif]">
                <div className="p-5">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Destinatário</div>
                  <div className="text-xl font-extrabold leading-tight mb-2">
                    {addr?.name || order.customer_name}
                  </div>
                  {addr ? (
                    <div className="text-sm text-gray-700 leading-relaxed">
                      {addr.street && <div>{addr.street}{addr.number ? `, ${addr.number}` : ''}{addr.complement ? ` - ${addr.complement}` : ''}</div>}
                      {addr.neighborhood && <div>{addr.neighborhood}</div>}
                      {(addr.city || addr.state) && <div>{[addr.city, addr.state].filter(Boolean).join(' - ')}</div>}
                      {addr.zipcode && <div>CEP: {addr.zipcode}</div>}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">Endereço não informado</div>
                  )}
                </div>
                <hr className="border-t-2 border-gray-900" />
                <div className="p-5 bg-gray-50">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Remetente</div>
                  <div className="font-bold text-sm">{storeName}</div>
                  <div className="text-xs text-gray-500 mt-1 font-mono">Pedido: #{order.order_code}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 gap-3">
          <p className="text-xs text-gray-400">
            {activeTab === 'invoice'
              ? 'Documento sem valor fiscal'
              : 'Cole na embalagem do pedido'}
          </p>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={onClose}>
              Fechar
            </Button>
            <Button size="sm" onClick={handlePrint} className="gap-1.5">
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
