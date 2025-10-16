export interface Niche {
  id: number
  name: string
  slug: string
  description: string
  icon: string
  color: string
  status: number
  sort_order: number
  created_at: string
  updated_at: string
  _count: {
    store_niches: number
  }
}

export interface NicheField {
  id: number
  name: string
  slug: string
  field_type: 'text' | 'select' | 'color' | 'number' | 'textarea'
  options: string[]
  required: number
  sort_order: number
  status: number
  created_at: string
  updated_at: string
  niche_id: number
  niche: {
    id: number
    name: string
    slug: string
  }
}

export interface NicheResponse {
  data: Niche[]
  message: string
}

export interface NicheFieldValue {
  field_id: number
  value: string | string[]
}
