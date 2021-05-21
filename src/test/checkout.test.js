const { globals } = require('../../jest.config')

describe('Checkout tests', () => {
  test('Guest can add a product to cart', async () => {
    const initialNumberOfProducts = await productsPage.header.getNumberOfCartProducts()
    await productsPage.addProductToCart()
    const currentNumberOfProducts = await productsPage.header.getNumberOfCartProducts()
    let expectedNumberOfProducts = initialNumberOfProducts + 1

    if (globals.FAIL_DEMO) {
      expectedNumberOfProducts++
    }

    await expect(currentNumberOfProducts).toBe(expectedNumberOfProducts)
  })
})
