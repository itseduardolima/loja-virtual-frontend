import { useState, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useStoreInfo } from '@/hooks/useStoreInfo'
import { useStoreCategories } from '@/hooks/useStoreCategories'
import { useStoreProducts } from '@/hooks/useStoreProducts'
import { useNiches, useStoreFields } from '@/hooks/useNiches'
import { useWishlist } from '@/hooks/useWishlist'
import { useCart } from '@/hooks/useCart'
import { useDebounce } from '@/hooks/useDebounce'
import { formatBRL } from '@/lib/storefront'
import type { Product } from '@/types/product'
import type { StoreCategory, CollectionSort } from '@/types/store'
import type { NicheField } from '@/types/niche'
import type {
  PlpFilters,
  PlpFacet,
  PlpView,
  PlpChip,
  PlpCategory,
  PlpFilterPanelProps,
} from '@/components/Store/Plp/types'
import type { UseStorePageReturn, PlpHeroNiche } from './types'

interface UseStorePageProps {
  slug: string
  initialCategoryId?: number
}

// Ordem visual de tamanhos (índices conhecidos primeiro, depois numérico crescente)
const SIZE_ORDER = ['PP', 'P', 'M', 'G', 'GG', 'XG']

const SORT_TO_PARAMS: Record<CollectionSort, { sort: 'ASC' | 'DESC'; sort_field: string }> = {
  relevancia: { sort: 'DESC', sort_field: 'created_at' },
  menor: { sort: 'ASC', sort_field: 'price' },
  maior: { sort: 'DESC', sort_field: 'price' },
  avaliados: { sort: 'DESC', sort_field: 'average_rating' },
  nome: { sort: 'ASC', sort_field: 'name' },
}

const EMPTY_FILTERS: PlpFilters = {
  nicheId: null,
  categoryIds: [],
  colors: [],
  sizes: [],
  dyn: {},
  maxPrice: Infinity,
  minRating: 0,
  promo: false,
  featured: false,
}

// Cores derivadas dos produtos quando o nicho não define opções (fallback)
function colorsFromProducts(products: Product[]): string[] {
  const colors = new Set<string>()
  products.forEach((p) => {
    ;(p.colors ?? []).forEach((c) => {
      if (typeof c === 'string')
        c.split(',').forEach((v) => {
          const t = v.trim()
          if (t) colors.add(t)
        })
    })
  })
  return Array.from(colors)
}

function sizesFromProducts(products: Product[]): string[] {
  const sizes = new Set<string>()
  products.forEach((p) => {
    ;(p.sizes ?? []).forEach((s) => {
      if (typeof s === 'string')
        s.split(',').forEach((v) => {
          const t = v.trim()
          if (t) sizes.add(t)
        })
    })
  })
  return Array.from(sizes)
}

function sortSizes(sizes: string[]): string[] {
  return [...sizes].sort((a, b) => {
    const ai = SIZE_ORDER.indexOf(a)
    const bi = SIZE_ORDER.indexOf(b)
    if (ai !== -1 && bi !== -1) return ai - bi
    if (ai !== -1) return -1
    if (bi !== -1) return 1
    return (parseInt(a, 10) || 0) - (parseInt(b, 10) || 0)
  })
}

export function useStorePage({ slug, initialCategoryId }: UseStorePageProps): UseStorePageReturn {
  const router = useRouter()

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 1000)
  const [sort, setSort] = useState<CollectionSort>('relevancia')
  const [view, setView] = useState<PlpView>('grid')
  const [filters, setFilters] = useState<PlpFilters>(() => ({
    ...EMPTY_FILTERS,
    categoryIds: initialCategoryId ? [initialCategoryId] : [],
  }))
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Dados compostos aqui para que a page não importe hooks de dado diretamente
  const {
    storeInfo,
    loading: storeLoading,
    error: storeError,
    refetch: refetchStore,
  } = useStoreInfo(slug)
  const { categories: storeCategories } = useStoreCategories(slug)
  const { data: nichesData } = useNiches(storeInfo?.id ?? null)
  const { data: storeFieldsData } = useStoreFields(storeInfo?.id ?? null)
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { addToCart } = useCart(storeInfo?.id)

  const allStoreFields: NicheField[] = useMemo(() => storeFieldsData ?? [], [storeFieldsData])
  const storeNiches = useMemo(() => nichesData?.data ?? [], [nichesData])
  const sortParams = SORT_TO_PARAMS[sort]

  // Nicho efetivo das facetas: o selecionado no filtro, ou o único da loja.
  // Loja multi-nicho sem seleção → null → facetas de nicho não renderizam
  // (senão Tamanho misturaria PP–GG de Roupas com 34–46 de Numeração, etc.)
  const effectiveNicheId = filters.nicheId ?? (storeNiches.length === 1 ? storeNiches[0].id : null)

  // Preço de busca só commita após debounce — evita refetch a cada arraste do slider
  const committedMaxPrice = useDebounce(filters.maxPrice, 400)

  // dynamic_filters: campos de especificação + dimensões color/size mapeadas pelo nome do campo
  const colorField = useMemo(
    () =>
      effectiveNicheId != null
        ? allStoreFields.find(
            (f) => f.variant_dimension === 'color' && f.niche_id === effectiveNicheId,
          )
        : undefined,
    [allStoreFields, effectiveNicheId],
  )
  const sizeField = useMemo(
    () =>
      effectiveNicheId != null
        ? allStoreFields.find(
            (f) => f.variant_dimension === 'size' && f.niche_id === effectiveNicheId,
          )
        : undefined,
    [allStoreFields, effectiveNicheId],
  )

  // Params enviados direto ao hook — ele re-sincroniza sozinho via incomingKey
  const dynamicFilters = useMemo(() => {
    const out: Record<string, string[]> = {}
    Object.entries(filters.dyn).forEach(([k, v]) => {
      if (v.length) out[k] = v
    })
    if (colorField && filters.colors.length) out[colorField.name] = filters.colors
    if (sizeField && filters.sizes.length) out[sizeField.name] = filters.sizes
    return Object.keys(out).length ? out : undefined
  }, [filters.dyn, filters.colors, filters.sizes, colorField, sizeField])

  // priceMax cresce mas nunca encolhe (lido direto no render para os params abaixo)
  const priceMaxRef = useRef(1000)

  const {
    products,
    loading: productsLoading,
    isFetchingMore,
    loadMoreError,
    meta,
    nextCursor,
    loadMore,
  } = useStoreProducts({
    slug,
    cursor: 0, // zero literal: liga o modo cursor desde a 1ª página (backend retorna meta.total + nextCursor)
    limit: 12,
    sort: sortParams.sort,
    sort_field: sortParams.sort_field,
    category_ids: filters.categoryIds.length ? filters.categoryIds : undefined,
    niche_id: filters.nicheId ?? undefined,
    max_price:
      Number.isFinite(committedMaxPrice) && committedMaxPrice < priceMaxRef.current
        ? committedMaxPrice
        : undefined,
    min_rating: filters.minRating || undefined,
    promo: filters.promo || undefined,
    featured: filters.featured || undefined,
    dynamic_filters: dynamicFilters,
    search: debouncedSearch || undefined,
  })

  // Valor exibido do slider: deriva do ref monotônico, atualizado quando produtos chegam
  const priceMax = useMemo(() => {
    if (products.length) {
      const max = Math.ceil(Math.max(...products.map((p) => parseFloat(p.price))) / 50) * 50
      if (max > priceMaxRef.current) priceMaxRef.current = max
    }
    return priceMaxRef.current
  }, [products])

  // ── Facetas (escopadas pelo nicho efetivo, fallback nos produtos carregados) ──
  // Sem campo variant_dimension do nicho não há como filtrar no backend — faceta nem renderiza
  const colorFacet = useMemo(() => {
    if (!colorField) return []
    const fromNiche = new Set<string>()
    allStoreFields
      .filter((f) => f.variant_dimension === 'color' && f.niche_id === effectiveNicheId)
      .forEach((f) => (f.options ?? []).forEach((o) => fromNiche.add(o)))
    if (fromNiche.size) return Array.from(fromNiche)
    return colorsFromProducts(products)
  }, [colorField, allStoreFields, effectiveNicheId, products])

  const sizeFacet = useMemo(() => {
    if (!sizeField) return []
    const fromNiche = new Set<string>()
    allStoreFields
      .filter((f) => f.variant_dimension === 'size' && f.niche_id === effectiveNicheId)
      .forEach((f) => (f.options ?? []).forEach((o) => fromNiche.add(o)))
    const base = fromNiche.size ? Array.from(fromNiche) : sizesFromProducts(products)
    return sortSizes(base)
  }, [sizeField, allStoreFields, effectiveNicheId, products])

  const dynFacets = useMemo<PlpFacet[]>(() => {
    const seen = new Map<string, PlpFacet>()
    allStoreFields
      .filter(
        (f) => !f.variant_dimension && (f.field_type === 'radio' || f.field_type === 'select'),
      )
      // só as facetas do nicho efetivo (multi-nicho sem seleção → nenhuma)
      .filter((f) => effectiveNicheId != null && f.niche_id === effectiveNicheId)
      .forEach((f) => {
        const existing = seen.get(f.name)
        if (existing) {
          // dedup por name: mescla options únicas na 1ª ocorrência
          const merged = new Set(existing.options)
          ;(f.options ?? []).forEach((o) => merged.add(o))
          existing.options = Array.from(merged)
        } else {
          seen.set(f.name, {
            name: f.name,
            type: f.field_type as 'radio' | 'select',
            options: [...(f.options ?? [])],
          })
        }
      })
    return Array.from(seen.values()).filter((f) => f.options.length > 0)
  }, [allStoreFields, effectiveNicheId])

  // ── Handlers de filtro (setState puro) ───────────────────────────────────────
  const toggleNiche = (id: number) =>
    setFilters((p) => {
      const nicheId = p.nicheId === id ? null : id
      // desmarcou num multi-nicho: facetas somem do painel → limpa seleções órfãs
      if (!nicheId) return { ...p, nicheId: null, colors: [], sizes: [], dyn: {} }

      // poda seleções que não existem no novo nicho — evita filtro ativo sem pill visível
      const validCatIds = new Set(
        (storeCategories ?? [])
          .filter((c: StoreCategory) => c.niche_id === nicheId)
          .map((c: StoreCategory) => c.id),
      )
      const optionsOf = (predicate: (f: NicheField) => boolean) =>
        new Set(
          allStoreFields
            .filter((f) => f.niche_id === nicheId && predicate(f))
            .flatMap((f) => f.options ?? []),
        )
      const colorOpts = optionsOf((f) => f.variant_dimension === 'color')
      const sizeOpts = optionsOf((f) => f.variant_dimension === 'size')
      const dyn: Record<string, string[]> = {}
      Object.entries(p.dyn).forEach(([name, vals]) => {
        const opts = new Set(
          allStoreFields
            .filter((f) => f.niche_id === nicheId && !f.variant_dimension && f.name === name)
            .flatMap((f) => f.options ?? []),
        )
        const kept = vals.filter((v) => opts.has(v))
        if (kept.length) dyn[name] = kept
      })
      return {
        ...p,
        nicheId,
        categoryIds: p.categoryIds.filter((cid) => validCatIds.has(cid)),
        colors: p.colors.filter((c) => colorOpts.has(c)),
        sizes: p.sizes.filter((s) => sizeOpts.has(s)),
        dyn,
      }
    })

  const toggleCategory = (id: number) =>
    setFilters((p) => ({
      ...p,
      categoryIds: p.categoryIds.includes(id)
        ? p.categoryIds.filter((c) => c !== id)
        : [...p.categoryIds, id],
    }))

  const toggleColor = (color: string) =>
    setFilters((p) => ({
      ...p,
      colors: p.colors.includes(color) ? p.colors.filter((c) => c !== color) : [...p.colors, color],
    }))

  const toggleSize = (size: string) =>
    setFilters((p) => ({
      ...p,
      sizes: p.sizes.includes(size) ? p.sizes.filter((s) => s !== size) : [...p.sizes, size],
    }))

  const toggleDyn = (facet: PlpFacet, value: string) =>
    setFilters((p) => {
      const dyn = { ...p.dyn }
      if (facet.type === 'radio') {
        // single-select: clicar o mesmo valor limpa a chave
        if (dyn[facet.name]?.[0] === value) delete dyn[facet.name]
        else dyn[facet.name] = [value]
      } else {
        const cur = dyn[facet.name] ?? []
        const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]
        if (next.length) dyn[facet.name] = next
        else delete dyn[facet.name]
      }
      return { ...p, dyn }
    })

  const setMaxPrice = (value: number) => setFilters((p) => ({ ...p, maxPrice: value }))
  const setMinRating = (rating: number) => setFilters((p) => ({ ...p, minRating: rating }))
  const togglePromo = () => setFilters((p) => ({ ...p, promo: !p.promo }))
  const toggleFeatured = () => setFilters((p) => ({ ...p, featured: !p.featured }))
  const clearAll = () => setFilters({ ...EMPTY_FILTERS }) // não limpa a busca

  // ── Produto: navegação, quick-add, wishlist ──────────────────────────────────
  const openProduct = (product: Product) => {
    router.push(`/loja/${slug}/produto/${product.id}`)
  }

  const quickAdd = (product: Product) => {
    addToCart({
      productId: product.id,
      quantity: 1,
      size: '',
      color: '',
      notes: '',
      storeId: product.store_id ?? storeInfo?.id,
    })
    setIsCartOpen(true)
  }

  const toggleWishlistProduct = (product: Product) => toggleWishlist(product.id)

  // ── Chips de filtros ativos ──────────────────────────────────────────────────
  const categoryName = (id: number) =>
    (storeCategories ?? []).find((c: StoreCategory) => c.id === id)?.name ?? `Categoria ${id}`

  const chips = useMemo<PlpChip[]>(() => {
    const list: PlpChip[] = []
    if (filters.nicheId) {
      const niche = nichesData?.data?.find((n) => n.id === filters.nicheId)
      list.push({
        key: 'niche',
        label: niche?.name ?? 'Tipo',
        remove: () => setFilters((p) => ({ ...p, nicheId: null })),
      })
    }
    filters.categoryIds.forEach((id) =>
      list.push({ key: `cat-${id}`, label: categoryName(id), remove: () => toggleCategory(id) }),
    )
    filters.colors.forEach((c) =>
      list.push({ key: `color-${c}`, label: `Cor: ${c}`, remove: () => toggleColor(c) }),
    )
    filters.sizes.forEach((s) =>
      list.push({ key: `size-${s}`, label: `Tam ${s}`, remove: () => toggleSize(s) }),
    )
    Object.entries(filters.dyn).forEach(([name, vals]) =>
      vals.forEach((v) =>
        list.push({
          key: `dyn-${name}-${v}`,
          label: `${name}: ${v}`,
          remove: () =>
            setFilters((p) => {
              const dyn = { ...p.dyn }
              const next = (dyn[name] ?? []).filter((x) => x !== v)
              if (next.length) dyn[name] = next
              else delete dyn[name]
              return { ...p, dyn }
            }),
        }),
      ),
    )
    if (filters.maxPrice < priceMax)
      list.push({
        key: 'price',
        label: `Até ${formatBRL(filters.maxPrice)}`,
        remove: () => setMaxPrice(Infinity),
      })
    if (filters.minRating)
      list.push({
        key: 'rating',
        label: `${filters.minRating}★ ou mais`,
        remove: () => setMinRating(0),
      })
    if (filters.promo)
      list.push({ key: 'promo', label: 'Em promoção', remove: () => togglePromo() })
    if (filters.featured)
      list.push({ key: 'featured', label: 'Em destaque', remove: () => toggleFeatured() })
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, priceMax, storeCategories, nichesData])

  const activeCount = chips.length

  // ── Derivados de exibição ────────────────────────────────────────────────────
  const pageTitle = useMemo(() => {
    if (filters.categoryIds.length === 1) return categoryName(filters.categoryIds[0])
    if (filters.nicheId) {
      const niche = nichesData?.data?.find((n) => n.id === filters.nicheId)
      if (niche) return niche.name
    }
    return 'Todos os produtos'
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.categoryIds, filters.nicheId, storeCategories, nichesData])

  // Badge do hero segue o nicho efetivo (multi-nicho sem seleção → sem badge)
  const heroNiche: PlpHeroNiche | null = useMemo(() => {
    const niche =
      effectiveNicheId != null ? storeNiches.find((n) => n.id === effectiveNicheId) : undefined
    return niche ? { name: niche.name, slug: niche.slug } : null
  }, [storeNiches, effectiveNicheId])

  const resultCount = meta?.total ?? products.length

  const panelProps: PlpFilterPanelProps = {
    filters,
    niches: (nichesData?.data ?? []).map((n) => ({ id: n.id, name: n.name, slug: n.slug })),
    // com nicho selecionado, lista só as categorias padrão daquele nicho
    categories: (storeCategories ?? [])
      .filter((c: StoreCategory) => !filters.nicheId || c.niche_id === filters.nicheId)
      .map<PlpCategory>((c: StoreCategory) => ({
        id: c.id,
        name: c.name,
        count: c._count?.products ?? 0,
      })),
    colorFacet,
    sizeFacet,
    colorLabel: colorField?.name,
    sizeLabel: sizeField?.name,
    dynFacets,
    priceMax,
    onToggleNiche: toggleNiche,
    onToggleCategory: toggleCategory,
    onToggleColor: toggleColor,
    onToggleSize: toggleSize,
    onToggleDyn: toggleDyn,
    onSetMaxPrice: setMaxPrice,
    onSetMinRating: setMinRating,
    onTogglePromo: togglePromo,
    onToggleFeatured: toggleFeatured,
  }

  return {
    storeInfo: storeInfo ?? null,
    storeLoading,
    storeError: storeError ?? null,
    search,
    setSearch,
    debouncedSearch,
    sort,
    setSort,
    view,
    setView,
    isCartOpen,
    setIsCartOpen,
    isDrawerOpen,
    setIsDrawerOpen,
    products,
    productsLoading,
    isFetchingMore,
    loadMoreError,
    nextCursor,
    loadMore,
    resultCount,
    pageTitle,
    heroNiche,
    chips,
    activeCount,
    panelProps,
    clearAll,
    openProduct,
    quickAdd,
    toggleWishlistProduct,
    isWished: isInWishlist,
    refetch: refetchStore,
  }
}
