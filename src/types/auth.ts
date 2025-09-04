export type UserProfile = 'Administrador' | 'Vendedor' | 'Cliente'

export interface User {
  id: number
  email: string
  name: string
  profile_id: number
  first_access: number
  profile: UserProfile
  transactions: number[]
}

export const PROFILE_ROUTES = {
  Administrador: '/admin',
  Vendedor: '/vendedor',
  Cliente: '/cliente'
} as const

export const PROFILE_TRANSACTIONS = {
  Administrador: [100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200],
  Vendedor: [200, 210, 220, 230, 240, 250],
  Cliente: [300, 310, 320, 330]
} as const

export const PROFILE_IDS = {
  Administrador: 1,
  Vendedor: 2,
  Cliente: 3
} as const

export interface LoginRequest {
  login: string
  password: string
}

export interface LoginResponse {
  user: User
  access_token: string
  refresh_token: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}

export interface ApiError {
  message: string
  status: number
  code?: string
}
