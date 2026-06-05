// Components
export { ColorPickerField } from './ColorPickerField'
export { CompletionMeter } from './CompletionMeter'
export { PreviewCard } from './PreviewCard'
export { ProductFormSections } from './ProductFormSections'
export { PublishCard } from './PublishCard'
export { StorefrontPreviewModal } from './StorefrontPreviewModal'

// Primitives (layout, fields, buttons, misc)
export {
  SectionCard,
  SectionHeader,
  FieldGrid,
  Field,
  FieldLabel,
  FieldHelp,
  Notice,
  ToggleRow,
  NxButton,
  RadioPills,
  CheckChips,
  NxBadge,
  NxTooltip,
  Stepper,
  Swatch,
  ChevronDown,
} from './primitives'

// Inputs (form controls)
// Note: NxButton and NxBadge live in primitives.tsx only; no name clash exists.
export { nxInputClass, NxInput, NxTextarea, NxSelectNative } from './inputs'
export type { NxInputProps, NxTextareaProps } from './inputs'

// Data helpers
export {
  COLOR_FAMILIES,
  getColorHex,
  colorLuma,
  getNicheIcon,
  formatBRL,
  parseBRL,
  slugify,
} from './data'

// Utilities
export { usePreviewUrlCache, buildPreviewData } from './previewUtils'
export { buildProductFormData } from './buildProductFormData'
export { computeCompletion } from './completion'

// Hooks
export { useSharedProductState } from './useSharedProductState'
export { useFormWatchers } from './useFormWatchers'

// Types
export type { OrderedImage, CompletionItem, StorefrontPreviewData } from './types'

// Sections
export { BasicInfoSection } from './sections/BasicInfoSection'
export { ImagesSection } from './sections/ImagesSection'
export { NicheSection } from './sections/NicheSection'
export { SpecsSection } from './sections/SpecsSection'
export { VariantsSection } from './sections/VariantsSection'
