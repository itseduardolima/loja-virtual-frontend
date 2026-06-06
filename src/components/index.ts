export { Button } from '@/components/ui/button'
export { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
export { Badge } from '@/components/ui/badge'
export { Input } from '@/components/ui/input'
export { Label } from '@/components/ui/label'
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
export { Textarea } from '@/components/ui/textarea'
export { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination'
export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
export { Table as TableUI, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from '@/components/ui/table'
export { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast'
export { Switch } from '@/components/ui/switch'
export { Checkbox } from '@/components/ui/checkbox'
// Layout Components
export { LoadingSpinner } from './Layout/LoadingSpinner'
export { ErrorState } from './Layout/ErrorState'
export { default as LoadingPage } from './Layout/LoadingPage'
export { default as AccessDenied } from './Layout/AccessDenied'
export { default as SubscriptionBlocked } from './Layout/SubscriptionBlocked'
export { NotFoundContent } from './Layout/NotFoundContent'
export { ProfileInfo } from './Layout/ProfileInfo'
export { SidebarVendedor } from './Layout/SidebarVendedor'
export { SidebarAdmin } from './Layout/SidebarAdmin'
export { NexoLeftPanel } from './Layout/NexoLeftPanel'
export { UserHeader } from './Layout/UserHeader'
export { UserHeaderCliente } from './Layout/UserHeaderCliente'

// Auth Components (login, cadastro, esqueci-senha, reset-password)
export * from './Auth'

// Product Components
export { ProductCard } from './Product/ProductCard'
export { ProductFilters } from './Product/ProductFilters'
export type { FiltersState } from './Product/ProductFilters'
export { EmptyImageState } from './Product/EmptyImageState'
export { ProductVariations } from './Product/ProductVariations'
export { ProductReviews } from './Product/ProductReviews'

// Table Components
export { Table } from './Table/Table'
export { TableFilters } from './Table/TableFilters'
export type { TableFiltersState } from './Table/TableFilters'
export { TablePagination } from './Table/TablePagination'
export type { Column, TableProps } from './Table/Table'

// Store Components
export { StorePagination } from './Store/StorePagination'
export { StorePendingFields } from './Store/StorePendingFields'
export { StoreHeader } from './Store/StoreHeader'
export { CustomerOrdersDrawer } from './Store/CustomerOrdersDrawer'
export { StoreCollectionSection } from './Store/StoreCollectionSection'
export { StoreFeatureBanner } from './Store/StoreFeatureBanner'
export { StoreHomeCard } from './Store/StoreHomeCard'
export { StoreHomeHero } from './Store/StoreHomeHero'
export { StoreMarquee } from './Store/StoreMarquee'
export { StoreSectionHeader } from './Store/StoreSectionHeader'

// Category Components
export { CategorySection } from './Category/CategorySection'
export { CreateCategoryModal } from './Category/CreateCategoryModal'

// Cart Components
export { CartSidebar } from './Cart/CartSidebar'

// Checkout Components
export { CheckoutModal } from './Checkout/CheckoutModal'

// Order Components
export { OrderTrackingTimeline } from './Order/OrderTrackingTimeline'

// Product Form Components (redesign criar/editar produto)
export { BasicInfoSection } from './ProductForm/sections/BasicInfoSection'
export { NicheSection } from './ProductForm/sections/NicheSection'
export { VariantsSection } from './ProductForm/sections/VariantsSection'
export { ImagesSection } from './ProductForm/sections/ImagesSection'
export { SpecsSection } from './ProductForm/sections/SpecsSection'
export { ColorPickerField } from './ProductForm/ColorPickerField'
export { CompletionMeter } from './ProductForm/CompletionMeter'
export { PreviewCard } from './ProductForm/PreviewCard'
export { PublishCard } from './ProductForm/PublishCard'
export { StorefrontPreviewModal } from './ProductForm/StorefrontPreviewModal'

// Dialog Components
export { ConfirmDialog } from './Dialog/ConfirmDialog'

// Vendor Home Components
export { KpiCard, Checklist, StoreCard, HomeGreeting } from './Vendor/Home'
export type { KpiTone, CheckItem } from './Vendor/Home'

// Toast Components
export { ToastContainer } from './Toast/ToastContainer'

// Legacy Dashboard Components (still used outside /vendedor/dashboard)
export { DashboardStatsCard } from './Dashboard/DashboardStatsCard'

// Vendor Dashboard Components
export {
  DashboardHeader,
  DashboardPeriodChips,
  DashboardKpiGrid,
  DashboardRevenueChart,
  DashboardTopProducts,
  DashboardRecentOrders,
} from './Vendor/Dashboard'
export type { PeriodKey, DashboardRangeValue } from './Vendor/Dashboard'

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from './ui/chart'
