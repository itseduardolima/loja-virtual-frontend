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
    const input = page
      .getByPlaceholder(/código|rastrear|pedido/i)
      .or(page.getByLabel(/código|rastrear|pedido/i))
      .or(page.locator('input[type="text"]').first())

    await expect(input.first()).toBeVisible({ timeout: 5000 })
  })

  test('exibe erro para código inválido', async ({ page }) => {
    const input = page
      .getByPlaceholder(/código|rastrear|pedido/i)
      .or(page.locator('input[type="text"]').first())

    await input.first().fill('PEDIDO_INVALIDO_XYZ')

    const submitBtn = page.getByRole('button', { name: /rastrear|buscar|pesquisar/i })
    await submitBtn.click()

    const errorMsg = page.getByText(/não encontrado|inválido|erro|não existe/i)
    await expect(errorMsg.first()).toBeVisible({ timeout: 8000 })
  })

  test('exibe validação para campo vazio', async ({ page }) => {
    const submitBtn = page.getByRole('button', { name: /rastrear|buscar|pesquisar/i })
    await submitBtn.click()

    const validation = page.getByText(/obrigatório|preencha|required|informe/i)
    await expect(validation.first()).toBeVisible({ timeout: 3000 })
  })

  test('heading de rastreamento está presente', async ({ page }) => {
    const heading = page
      .getByRole('heading', { name: /rastrear|acompanhar|pedido/i })
      .or(page.getByText(/rastrear seu pedido/i))

    await expect(heading.first()).toBeVisible({ timeout: 5000 })
  })
})
