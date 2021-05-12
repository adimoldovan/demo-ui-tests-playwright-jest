describe('Authentication tests', () => {
  test('Normal user can login', async () => {
    const loginModal = await productsPage.header.openLogin()
    await loginModal.login('dino', 'choochoo')

    await expect(page.title()).resolves.toMatch('Demo shop')
    const element = await page.$("a[href='#/account']")
    await expect(await page.evaluate(element => element.textContent, element)).toBe('dino')
  })
})
