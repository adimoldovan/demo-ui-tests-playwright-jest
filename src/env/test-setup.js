import logger from '../logger'
import { ProductsPage } from '../page/products.page'

beforeEach(async () => {
  global.page = await global.context.newPage()

  const userAgent = await page.evaluate(() => navigator.userAgent)
  logger.info(global.chalk.blue(`User agent: ${userAgent}`))

  await page.goto(URL, { waitUntil: 'domcontentloaded' })
  global.productsPage = await new ProductsPage(page)
})
