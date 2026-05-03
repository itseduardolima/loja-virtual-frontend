import { test as setup, expect } from '@playwright/test'
import path from 'path'

export const STORAGE_STATE = path.join(__dirname, '.auth/vendor.json')

const VENDOR_EMAIL = process.env.TEST_VENDOR_EMAIL || 'vendedor@teste.com'
const VENDOR_PASSWORD = process.env.TEST_VENDOR_PASSWORD || 'senha123'

setup('authenticate as vendor', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill(VENDOR_EMAIL)
  await page.getByLabel('Senha').fill(VENDOR_PASSWORD)
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()

  try {
    await page.waitForURL(/\/vendedor(\/|$)/, { timeout: 20000 })
  } catch {
    if (/\/login/.test(page.url())) {
      throw new Error(
        `Setup falhou: credenciais ${VENDOR_EMAIL} foram rejeitadas. ` +
          `Defina TEST_VENDOR_EMAIL e TEST_VENDOR_PASSWORD com um Vendedor real.`,
      )
    }
    throw new Error(`Setup falhou: redirect inesperado pra ${page.url()}`)
  }

  // Confirma que a sessão foi estabelecida (cookie salvo)
  await expect(page).toHaveURL(/\/vendedor/)

  await page.context().storageState({ path: STORAGE_STATE })
})
