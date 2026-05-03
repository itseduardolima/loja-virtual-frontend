import type { Page } from '@playwright/test'

export const VENDOR_EMAIL = process.env.TEST_VENDOR_EMAIL || 'vendedor@teste.com'
export const VENDOR_PASSWORD = process.env.TEST_VENDOR_PASSWORD || 'senha123'

/**
 * Loga via UI como vendedor e aguarda o redirect pra área autenticada.
 * Use em `beforeEach` dos testes que dependem de sessão de Vendedor.
 *
 * Defina as credenciais via env vars antes de rodar:
 *   TEST_VENDOR_EMAIL=seu@email.com TEST_VENDOR_PASSWORD=suasenha pnpm exec playwright test
 *
 * Os defaults `vendedor@teste.com` / `senha123` quase nunca existem — sobrescreva.
 */
export async function loginAsVendor(page: Page): Promise<void> {
  await page.goto('/login')
  await page.getByLabel('Email').fill(VENDOR_EMAIL)
  await page.getByLabel('Senha').fill(VENDOR_PASSWORD)
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()

  try {
    await page.waitForURL(/\/vendedor(\/|$)/, { timeout: 15000 })
  } catch (err) {
    const stillOnLogin = /\/login/.test(page.url())
    if (stillOnLogin) {
      throw new Error(
        `loginAsVendor falhou: credenciais ${VENDOR_EMAIL} foram rejeitadas (ainda em /login). ` +
          `Defina TEST_VENDOR_EMAIL e TEST_VENDOR_PASSWORD com um usuário Vendedor real do banco.`,
      )
    }
    throw err
  }
}
