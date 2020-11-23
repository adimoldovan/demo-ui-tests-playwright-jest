const { HeaderModule } = require('./header.page')

class AppPage {
  constructor (page) {
    this.page = page
    this.header = new HeaderModule(this.page)
  }
}
module.exports = { AppPage }
