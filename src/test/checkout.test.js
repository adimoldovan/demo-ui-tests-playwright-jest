describe('Checkout tests', () => {
  test('Guest can add a product to cart', async () => {
    await page.click('div.card button.btn-link')
    const badge = await page.$('span.shopping_cart_badge')
    await expect(await page.evaluate(badge => badge.textContent, badge)).toBe('1')
  })
})
