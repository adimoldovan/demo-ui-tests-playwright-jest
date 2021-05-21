const { AppPage } = require('./app-page.page')
const { HeaderModule } = require('./header.page')

class ProductsPage extends AppPage {
  constructor (page) {
    super(page)
    this.header = new HeaderModule(this.page)
    this.ADD_TO_CART_BTN = 'div.card button.btn-link'
  }

  async isDisplayed () {
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(page.title()).resolves.toMatch('Demo shop')
  }

  async addProductToCart () {
    await page.click(this.ADD_TO_CART_BTN)
  }
}

module.exports = { ProductsPage }
