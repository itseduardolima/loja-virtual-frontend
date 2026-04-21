import { test, expect } from '@playwright/test'

test.describe('Autenticação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('exibe o formulário de login', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /entrar|login/i })).toBeVisible()
    await expect(page.getByLabel(/e-mail/i)).toBeVisible()
    await expect(page.getByLabel(/senha/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /entrar|login/i })).toBeVisible()
  })

  test('exibe erro com credenciais inválidas', async ({ page }) => {
    await page.getByLabel(/e-mail/i).fill('invalido@teste.com')
    await page.getByLabel(/senha/i).fill('senhaerrada')
    await page.getByRole('button', { name: /entrar|login/i }).click()

    await expect(
      page.getByText(/credenciais|incorretos|inválido|não encontrado/i),
    ).toBeVisible({ timeout: 5000 })
  })

  test('exibe erro de validação com campos vazios', async ({ page }) => {
    await page.getByRole('button', { name: /entrar|login/i }).click()

    await expect(page.getByText(/obrigatório|required|preencha/i).first()).toBeVisible({
      timeout: 3000,
    })
  })

  test('link para cadastro está presente e navega corretamente', async ({ page }) => {
    const cadastroLink = page.getByRole('link', { name: /cadastr|criar conta/i })
    await expect(cadastroLink).toBeVisible()
    await cadastroLink.click()
    await expect(page).toHaveURL(/cadastro/)
  })

  test('botão Google OAuth está visível', async ({ page }) => {
    await expect(page.getByRole('button', { name: /google/i })).toBeVisible()
  })
})

test.describe('Cadastro', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cadastro')
  })

  test('exibe o formulário de cadastro', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /cadastr|criar conta/i })).toBeVisible()
  })

  test('exibe erros de validação com campos vazios', async ({ page }) => {
    await page.getByRole('button', { name: /cadastr|criar|continuar/i }).click()
    await expect(page.getByText(/obrigatório|required/i).first()).toBeVisible({ timeout: 3000 })
  })
})
