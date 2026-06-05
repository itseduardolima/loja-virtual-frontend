import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // cookies httpOnly enviados automaticamente
})

// Flag para evitar múltiplas tentativas de refresh simultâneas
let isRefreshing = false

/** Fila de requests que chegaram com 401 enquanto o refresh estava em andamento. */
interface QueueEntry {
  resolve: (value: unknown) => void
  reject: (reason: unknown) => void
}

let failedQueue: QueueEntry[] = []

const processQueue = (error: unknown) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(undefined)
    }
  })
  failedQueue = []
}

api.interceptors.request.use((config) => {
  // FormData: deixar o navegador definir Content-Type com boundary correto
  if (config.data instanceof FormData && config.headers) {
    delete config.headers['Content-Type']
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(() => api(originalRequest))
          .catch(err => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Cookie refresh_token enviado automaticamente; novo access_token vai nos cookies
        await api.post('/auth/refresh_token', {})
        processQueue(null)
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError)
        localStorage.removeItem('user-data')
        // NAV exception: interceptor vive fora da árvore React (sem acesso ao router do Next.js),
        // portanto window.location.href é a única forma segura de redirecionar para /login após falha de refresh.
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
