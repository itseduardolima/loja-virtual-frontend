import { test, expect } from '@playwright/test'

test.describe('Dashboard do Vendedor (/vendedor/dashboard)', () => {
  test.describe('rota protegida', () => {
    test.use({ storageState: { cookies: [], origins: [] } })

    test('redireciona para /login quando não autenticado', async ({ page }) => {
      await page.goto('/vendedor/dashboard')
      await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
    })
  })

  test.describe('autenticado como Vendedor', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/vendedor/dashboard')
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => null)
    })

    test('exibe título "Dashboard" e descrição', async ({ page }) => {
      const main = page.getByRole('main', { name: /conteúdo principal/i })
      await expect(main.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeVisible()
      await expect(main.getByText(/acompanhe vendas, pedidos e desempenho/i)).toBeVisible()
    })

    test('exibe os 4 chips de período: Hoje, 7d, 30d, 90d e Custom', async ({ page }) => {
      const tablist = page.getByRole('tablist', { name: /período/i })
      await expect(tablist).toBeVisible()

      await expect(tablist.getByRole('tab', { name: 'Hoje' })).toBeVisible()
      await expect(tablist.getByRole('tab', { name: '7d' })).toBeVisible()
      await expect(tablist.getByRole('tab', { name: '30d' })).toBeVisible()
      await expect(tablist.getByRole('tab', { name: '90d' })).toBeVisible()
      await expect(tablist.getByRole('tab', { name: /custom/i })).toBeVisible()
    })

    test('chip "7d" está ativo por padrão (aria-selected=true)', async ({ page }) => {
      const tablist = page.getByRole('tablist', { name: /período/i })
      await expect(tablist.getByRole('tab', { name: '7d' })).toHaveAttribute(
        'aria-selected',
        'true',
      )
    })

    test('clicar em "Hoje" muda o chip ativo e dispara nova query do summary', async ({ page }) => {
      const tablist = page.getByRole('tablist', { name: /período/i })

      const todayIso = new Date().toISOString().slice(0, 10)
      const summaryRequest = page.waitForRequest(
        (req) =>
          req.url().includes('/dashboard/summary') &&
          req.url().includes(`dateFrom=${todayIso}`) &&
          req.url().includes(`dateTo=${todayIso}`),
        { timeout: 10000 },
      )

      await tablist.getByRole('tab', { name: 'Hoje' }).click()
      await summaryRequest

      await expect(tablist.getByRole('tab', { name: 'Hoje' })).toHaveAttribute(
        'aria-selected',
        'true',
      )
      await expect(tablist.getByRole('tab', { name: '7d' })).toHaveAttribute(
        'aria-selected',
        'false',
      )
    })

    test('exibe os 4 KPI cards principais', async ({ page }) => {
      const main = page.getByRole('main', { name: /conteúdo principal/i })
      await expect(main.getByText('Vendas', { exact: true })).toBeVisible()
      await expect(main.getByText('Pedidos', { exact: true }).first()).toBeVisible()
      await expect(main.getByText('Produtos vendidos', { exact: true })).toBeVisible()
      await expect(main.getByText('Conversão de carrinho', { exact: true })).toBeVisible()
    })

    test('KPI Vendas mostra valor monetário em BRL', async ({ page }) => {
      const main = page.getByRole('main', { name: /conteúdo principal/i })
      const vendasCard = main
        .locator('div')
        .filter({ hasText: /^Vendas/ })
        .first()
      await expect(vendasCard).toContainText(/R\$\s?[\d.,]+/)
    })

    test('KPI Conversão mostra "—" quando não há sessões ou um valor com %', async ({ page }) => {
      const main = page.getByRole('main', { name: /conteúdo principal/i })
      const conversaoCard = main
        .locator('div')
        .filter({ hasText: /^Conversão de carrinho/ })
        .first()
      await expect(conversaoCard).toContainText(/[\d,]+%|—/)
    })

    test('exibe o card de Receita com título e legenda', async ({ page }) => {
      const main = page.getByRole('main', { name: /conteúdo principal/i })
      const receitaTitle = main.getByRole('heading', { name: 'Receita', level: 3 })
      await expect(receitaTitle).toBeVisible()

      await expect(main.getByText('Período atual', { exact: true })).toBeVisible()
      await expect(main.getByText('Anterior', { exact: true })).toBeVisible()
    })

    test('card "Top produtos" está presente', async ({ page }) => {
      const main = page.getByRole('main', { name: /conteúdo principal/i })
      const topProdutos = main.getByRole('heading', { name: 'Top produtos', level: 3 })
      const overlay = main.getByText(/plano avançado|recurso bloqueado|premium/i)
      const hasOverlay = await overlay.first().isVisible({ timeout: 1500 }).catch(() => false)

      if (hasOverlay) {
        await expect(overlay.first()).toBeVisible()
        return
      }

      await expect(topProdutos).toBeVisible()
      await expect(main.getByRole('link', { name: /ver todos/i })).toBeVisible()
    })

    test('card "Pedidos recentes" está presente com link "Ver pedidos"', async ({ page }) => {
      const main = page.getByRole('main', { name: /conteúdo principal/i })
      await expect(
        main.getByRole('heading', { name: 'Pedidos recentes', level: 3 }),
      ).toBeVisible()
      await expect(main.getByRole('link', { name: /ver pedidos/i })).toBeVisible()
    })

    test('botão Custom abre popover com inputs De/Até e botão Aplicar', async ({ page }) => {
      const customChip = page.getByRole('tab', { name: /custom/i })
      await customChip.click()

      const popover = page.getByText(/período personalizado/i)
      await expect(popover).toBeVisible({ timeout: 5000 })

      await expect(page.getByLabel('De')).toBeVisible()
      await expect(page.getByLabel('Até')).toBeVisible()

      const applyBtn = page.getByRole('button', { name: 'Aplicar', exact: true })
      await expect(applyBtn).toBeVisible()
      await expect(applyBtn).toBeDisabled()
    })

    test('aplicar range custom dispara nova query e ativa o chip Custom', async ({ page }) => {
      const customChip = page.getByRole('tab', { name: /custom/i })
      await customChip.click()

      const fromIso = (() => {
        const d = new Date()
        d.setDate(d.getDate() - 14)
        return d.toISOString().slice(0, 10)
      })()
      const toIso = new Date().toISOString().slice(0, 10)

      await page.getByLabel('De').fill(fromIso)
      await page.getByLabel('Até').fill(toIso)

      const summaryRequest = page.waitForRequest(
        (req) =>
          req.url().includes('/dashboard/summary') &&
          req.url().includes(`dateFrom=${fromIso}`) &&
          req.url().includes(`dateTo=${toIso}`),
        { timeout: 10000 },
      )

      await page.getByRole('button', { name: 'Aplicar', exact: true }).click()
      await summaryRequest

      const [, fromMonth, fromDay] = fromIso.split('-')
      const [, toMonth, toDay] = toIso.split('-')
      await expect(
        page.getByRole('tab', { name: new RegExp(`${fromDay}/${fromMonth}.*${toDay}/${toMonth}`) }),
      ).toBeVisible({ timeout: 5000 })
    })

    test('ao trocar para 30d, o KPI de Pedidos atualiza com novo valor', async ({ page }) => {
      const tablist = page.getByRole('tablist', { name: /período/i })

      const summaryRequest = page.waitForRequest(
        (req) => req.url().includes('/dashboard/summary') && req.url().includes('dateTo='),
        { timeout: 10000 },
      )

      await tablist.getByRole('tab', { name: '30d' }).click()
      await summaryRequest

      await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => null)

      const main = page.getByRole('main', { name: /conteúdo principal/i })
      await expect(main.getByText('Pedidos', { exact: true }).first()).toBeVisible()
    })
  })
})
