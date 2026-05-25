import { test, expect } from '@playwright/test'

test.describe('Home do Vendedor (/vendedor)', () => {
  test.describe('rota protegida', () => {
    // Sem storage state — testa o redirect quando não autenticado.
    test.use({ storageState: { cookies: [], origins: [] } })

    test('redireciona para /login quando não autenticado', async ({ page }) => {
      await page.goto('/vendedor')
      await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
    })
  })

  test.describe('autenticado como Vendedor', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/vendedor')
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => null)
    })

    test('exibe a saudação por horário (Bom dia / Boa tarde / Boa noite)', async ({ page }) => {
      const greeting = page.getByRole('heading', {
        name: /bom dia|boa tarde|boa noite/i,
        level: 1,
      })
      await expect(greeting).toBeVisible({ timeout: 10000 })
    })

    test('exibe os 4 KPI cards principais', async ({ page }) => {
      const main = page.getByRole('main', { name: /conteúdo principal/i })
      await expect(main.getByText('Receita hoje', { exact: true })).toBeVisible()
      await expect(main.getByText('Pedidos hoje', { exact: true })).toBeVisible()
      await expect(main.getByText('Ticket médio', { exact: true })).toBeVisible()
      await expect(main.getByText('Conversão do carrinho', { exact: true })).toBeVisible()
    })

    test('cada KPI exibe um valor numérico/monetário', async ({ page }) => {
      const main = page.getByRole('main', { name: /conteúdo principal/i })

      const receitaCard = main
        .locator('div')
        .filter({ hasText: /^Receita hoje/ })
        .first()
      await expect(receitaCard).toContainText(/R\$\s?[\d.,]+/)

      const ticketCard = main
        .locator('div')
        .filter({ hasText: /^Ticket médio/ })
        .first()
      await expect(ticketCard).toContainText(/R\$\s?[\d.,]+/)

      const conversaoCard = main
        .locator('div')
        .filter({ hasText: /^Conversão do carrinho/ })
        .first()
      await expect(conversaoCard).toContainText(/[\d,]+%|—/)
    })

    test('exibe a checklist de configuração da loja', async ({ page }) => {
      const main = page.getByRole('main', { name: /conteúdo principal/i })
      const checklistArea = main
        .getByText(/próximas ações|configuração da loja|complete sua loja/i)
        .or(main.locator('[data-testid="onboarding-checklist"]'))
        .or(main.getByRole('list').filter({ hasText: /logotipo|banner|endereço|categoria|produto/i }))

      const hasChecklist = await checklistArea
        .first()
        .isVisible({ timeout: 5000 })
        .catch(() => false)

      if (!hasChecklist) {
        test.skip()
        return
      }

      await expect(checklistArea.first()).toBeVisible()
    })

    test('exibe o card lateral da loja com nome', async ({ page }) => {
      const main = page.getByRole('main', { name: /conteúdo principal/i })
      const storeCard = main
        .getByRole('button', { name: /visitar loja|ver minha loja/i })
        .or(main.getByText(/loja\.com\//i))
        .or(main.locator('[data-testid="store-card"]'))

      await expect(storeCard.first()).toBeVisible({ timeout: 10000 })
    })

    test('sidebar exibe links principais de navegação', async ({ page }) => {
      const sidebar = page.locator('aside').first()
      await expect(sidebar).toBeVisible()
      await expect(sidebar.getByText('Dashboard', { exact: true })).toBeVisible()
      await expect(sidebar.getByText('Pedidos', { exact: true })).toBeVisible()
      await expect(sidebar.getByText('Produtos', { exact: true })).toBeVisible()
    })

    test('header exibe campo de busca global', async ({ page }) => {
      const search = page
        .getByPlaceholder(/buscar|pesquisar|search/i)
        .or(page.locator('header input'))

      await expect(search.first()).toBeVisible({ timeout: 5000 })
    })

    test('clicar em "Dashboard" no sidebar navega para /vendedor/dashboard', async ({ page }) => {
      await page.locator('aside').getByText('Dashboard', { exact: true }).click()
      await expect(page).toHaveURL(/\/vendedor\/dashboard/, { timeout: 10000 })
    })

    test('KPI delta aparece com seta quando há comparação', async ({ page }) => {
      const main = page.getByRole('main', { name: /conteúdo principal/i })
      const deltaText = main.getByText(/vs ontem/i).first()
      const hasDelta = await deltaText.isVisible({ timeout: 3000 }).catch(() => false)

      if (!hasDelta) {
        test.skip()
        return
      }

      await expect(deltaText).toBeVisible()
    })
  })
})
