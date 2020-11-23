import { LoginModal } from './login.page'

class HeaderModule {
  constructor (page) {
    this.page = page
    this.LOGIN_BTN = 'span > button.btn-link'
    this.CART_BADGE = 'span.shopping_cart_badge'
  }

  /**
     * Opens the login modal
     * @returns {Promise<LoginModal>}
     */
  async openLogin () {
    await this.page.click(this.LOGIN_BTN)
    return new LoginModal(this.page)
  }

  async getNumberOfCartProducts () {
    if (!await this.page.$(this.CART_BADGE)) {
      return 0
    }
    return parseInt(await this.page.textContent(this.CART_BADGE))
  }
}

module.exports = { HeaderModule }
