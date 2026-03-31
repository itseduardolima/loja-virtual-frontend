import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // envia/recebe cookies httpOnly automaticamente
})

api.interceptors.request.use((config) => {
  // FormData: deixar o navegador definir Content-Type com boundary correto
  if (config.data instanceof FormData && config.headers) {
    delete config.headers['Content-Type']
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname
      const protectedPaths = ['/vendedor', '/admin']

      if (protectedPaths.some(path => currentPath.startsWith(path))) {
        localStorage.removeItem('user-data')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
