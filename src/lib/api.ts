// Re-exporta a instância única com refresh token rotation, FormData handling e fila de retry.
// Todos os imports de '@/lib/api' e '@/lib/axios' usam a mesma instância.
export { api } from './axios'
export { default } from './axios'
