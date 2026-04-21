import { test, expect } from '@playwright/test'

test.describe('Rastreamento de Pedido', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rastrear')
  })

  test('página de rastreamento carrega corretamente', async ({ page }) => {
    await expect(page).toHaveURL(/rastrear/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('exibe campo para inserir código do pedido', async ({ page }) => {
    // Placeholder real: "Ex: PED-20240001"
    const input = page.getByPlaceholder(/PED|código/i).or(page.locator('input').first())
    await expect(input.first()).toBeVisible({ timeout: 5000 })
  })

  test('exibe erro para código inválido', async ({ page }) => {
    // Input único na página — usa locator direto para evitar ambiguidade
    await page.locator('input').first().fill('PEDIDO_INVALIDO_XYZ')
    await page.getByRole('button', { name: /buscar/i }).click()

    // Aguarda API retornar e exibir "Pedido não encontrado"
    await expect(
      page.getByRole('heading', { name: /pedido não encontrado/i }),
    ).toBeVisible({ timeout: 15000 })
  })

  test('exibe validação para campo vazio', async ({ page }) => {
    // Botão fica desabilitado enquanto o campo estiver vazio
    const submitBtn = page.getByRole('button', { name: /buscar/i })
    await expect(submitBtn).toBeDisabled()
  })

  test('heading de rastreamento está presente', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /rastrear pedido/i }),
    ).toBeVisible({ timeout: 5000 })
  })
})
