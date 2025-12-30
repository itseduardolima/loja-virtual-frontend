import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Só redireciona se estivermos em uma página que requer autenticação
      const currentPath = window.location.pathname
      const protectedPaths = ['/vendedor', '/admin']
      
      if (protectedPaths.some(path => currentPath.startsWith(path))) {
        localStorage.removeItem('auth-token')
        localStorage.removeItem('user-data')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
