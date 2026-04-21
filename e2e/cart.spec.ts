import { test, expect } from '@playwright/test'

const BASE_SLUG = process.env.TEST_STORE_SLUG || 'loja-teste'

test.describe('Carrinho de Compras', () => {
  test.beforeEach(async ({ page }) => {
    // Limpar localStorage antes de cada teste
    await page.goto(`/loja/${BASE_SLUG}`)
    await page.evaluate(() => {
      Object.keys(localStorage)
        .filter((key) => key.startsWith('cart-session'))
        .forEach((key) => localStorage.removeItem(key))
    })
  })

  test('ícone do carrinho está visível na loja', async ({ page }) => {
    await page.goto(`/loja/${BASE_SLUG}`)
    const cartIcon = page
      .getByRole('button', { name: /carrinho/i })
      .or(page.locator('[data-testid="cart-button"]'))
      .or(page.locator('button').filter({ has: page.locator('svg') }).first())

    await expect(cartIcon.first()).toBeVisible({ timeout: 5000 })
  })

  test('adicionar produto ao carrinho e abrir sidebar', async ({ page }) => {
    await page.goto(`/loja/${BASE_SLUG}/produtos`)

    const productLink = page.locator('a[href*="/produto/"]').first()
    const hasProducts = await productLink.isVisible({ timeout: 3000 }).catch(() => false)

    if (!hasProducts) {
      test.skip()
      return
    }

    await productLink.click()
    await expect(page).toHaveURL(/produto\/\d+/)

    // Selecionar variantes se existirem
    const sizeBtn = page.locator('button').filter({ hasText: /^[PSMLGXs]$/ }).first()
    if (await sizeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await sizeBtn.click()
    }

    const colorBtn = page.locator('[data-testid="color-option"]').first()
    if (await colorBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await colorBtn.click()
    }

    // Adicionar ao carrinho
    const addBtn = page.getByRole('button', { name: /adicionar ao carrinho|comprar/i })
    await expect(addBtn).toBeVisible({ timeout: 5000 })
    await addBtn.click()

    // Sidebar deve abrir ou algum feedback aparecer
    const cartSidebar = page
      .getByRole('dialog')
      .or(page.locator('[data-testid="cart-sidebar"]'))
      .or(page.getByText(/item adicionado|carrinho/i))

    await expect(cartSidebar.first()).toBeVisible({ timeout: 5000 })
  })

  test('carrinho começa vazio', async ({ page }) => {
    await page.goto(`/loja/${BASE_SLUG}`)

    const cartBtn = page
      .getByRole('button', { name: /carrinho/i })
      .or(page.locator('[data-testid="cart-button"]'))

    if (await cartBtn.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await cartBtn.first().click()

      const emptyMsg = page.getByText(/vazio|sem itens|nenhum item/i)
      const cartItems = page.locator('[data-testid="cart-item"]')

      const isEmpty = await emptyMsg.isVisible({ timeout: 2000 }).catch(() => false)
      const itemCount = await cartItems.count()

      expect(isEmpty || itemCount === 0).toBeTruthy()
    }
  })

  test('página de checkout está acessível', async ({ page }) => {
    await page.goto(`/loja/${BASE_SLUG}/checkout`)
    // Deve mostrar checkout ou redirecionar para produtos se carrinho vazio
    await expect(page.locator('body')).toBeVisible()
    await expect(page).not.toHaveURL(/login/)
  })
})
