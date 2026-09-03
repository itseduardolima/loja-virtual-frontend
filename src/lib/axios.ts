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

    const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh_token')

    // Endpoints de auth pré-sessão: um 401 aqui é resposta normal do fluxo (senha
    // errada, token de reset inválido/expirado) — não indica sessão expirada, então
    // não deve disparar o ciclo de refresh nem o redirect de window.location.href
    // (bug: login com senha errada dava reload da própria página de login e o
    // usuário nunca via a mensagem de erro, porque o catch do componente nunca
    // era alcançado).
    const isPreAuthRequest =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/reset_password')

    // Se o próprio refresh falhar com 401, não tenta renovar de novo (evitaria
    // deadlock: essa chamada ficaria presa na fila esperando por si mesma).
    // Propaga o erro para o catch de quem chamou o refresh.
    if (error.response?.status === 401 && (isRefreshRequest || isPreAuthRequest)) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Marca _retry antes de reexecutar: sem isto, uma request reenfileirada
        // que tomasse 401 de novo (ex.: refresh ok mas endpoint nega por permissao)
        // dispararia OUTRO ciclo de refresh (bug S4).
        originalRequest._retry = true
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
