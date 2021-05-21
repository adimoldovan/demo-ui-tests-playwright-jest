const { logger } = require('../logger')
const chalk = require('chalk')
const { ProductsPage } = require('../page/products.page')

beforeEach(async () => {
  global.page = await global.context.newPage()

  const userAgent = await page.evaluate(() => navigator.userAgent)
  logger.info(chalk.blue(`User agent: ${userAgent}`))

  await page.goto(URL, { waitUntil: 'domcontentloaded' })
  global.productsPage = await new ProductsPage(page)
})
