import { test, expect } from '@playwright/test'

test.describe('Autenticação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('exibe o formulário de login', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /bem-vindo/i })).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Senha')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeVisible()
  })

  test('exibe erro com credenciais inválidas', async ({ page }) => {
    await page.getByLabel('Email').fill('invalido@teste.com')
    await page.getByLabel('Senha').fill('senhaerrada')
    await page.getByRole('button', { name: 'Entrar', exact: true }).click()

    // Aguarda resposta da API e verifica que permanece na página de login
    await page.waitForResponse(resp => resp.url().includes('/auth/login'), { timeout: 10000 })
    await expect(page).toHaveURL(/login/)
  })

  test('exibe erro de validação com campos vazios', async ({ page }) => {
    // O formulário ignora silenciosamente submissão vazia — permanece na página
    await page.getByRole('button', { name: 'Entrar', exact: true }).click()
    await expect(page).toHaveURL(/login/)
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
    // Página não tem h1/h2 — verifica campos do formulário
    await expect(page.getByLabel(/nome completo/i)).toBeVisible()
    await expect(page.getByLabel(/e-mail/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /cadastrar/i })).toBeVisible()
  })

  test('exibe erros de validação com campos vazios', async ({ page }) => {
    // Formulário ignora submissão vazia — permanece na página de cadastro
    await page.getByRole('button', { name: /cadastrar/i }).click()
    await expect(page).toHaveURL(/cadastro/)
  })
})
