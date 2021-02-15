import { globals } from '../jest.config'
import logger from './logger'
import { ProductsPage } from './page/products.page'

beforeEach(async () => {
  let userAgent = await page.evaluate(() => navigator.userAgent)

  await jestPlaywright.resetContext({
    userAgent: `E2E-tests ${userAgent}`
  })

  userAgent = await page.evaluate(() => navigator.userAgent)
  logger.info(`User agent: ${userAgent}`)

  await page.goto(URL, { waitUntil: 'domcontentloaded' })
  // eslint-disable-next-line no-unused-vars
  globals.productsPage = await new ProductsPage(page)
})
