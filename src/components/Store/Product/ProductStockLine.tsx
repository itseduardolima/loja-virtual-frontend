'use client'

interface ProductStockLineProps {
  currentStock: number
  hasSizes: boolean
  selectedColor: string | null
  selectedSize: string | null
  colorTotal: number | null
}

export function ProductStockLine({
  currentStock,
  hasSizes,
  selectedColor,
  selectedSize,
  colorTotal,
}: ProductStockLineProps) {
  // produto simples (sem variação de tamanho)
  if (!hasSizes) {
    return (
      <p className="mt-3 text-[12px] font-semibold">
        {currentStock === 0 ? (
          <span className="text-nxd">Esgotado</span>
        ) : currentStock <= 5 ? (
          <span className="text-nxa">Últimas {currentStock} unidades</span>
        ) : (
          <span className="text-nxs">Em estoque · {currentStock} unidades</span>
        )}
      </p>
    )
  }

  // com tamanho selecionado
  if (selectedSize) {
    const variantLabel = [selectedColor, selectedSize].filter(Boolean).join(' · ')
    return (
      <p className="mt-3 text-[12px] font-semibold">
        {currentStock === 0 ? (
          <span className="text-nxd">Essa combinação está esgotada</span>
        ) : currentStock <= 5 ? (
          <span className="text-nxa">
            Últimas {currentStock} unidades{variantLabel ? ` de ${variantLabel}` : ''}
          </span>
        ) : (
          <span className="text-nxs">Em estoque · pronta entrega</span>
        )}
      </p>
    )
  }

  // falta escolher o tamanho
  if (selectedColor && colorTotal != null) {
    return (
      <p className="mt-3 text-[12px] font-semibold text-nxi3">
        {colorTotal} unidade{colorTotal !== 1 ? 's' : ''} disponíve{colorTotal !== 1 ? 'is' : 'l'} em {selectedColor}
      </p>
    )
  }

  return null
}
