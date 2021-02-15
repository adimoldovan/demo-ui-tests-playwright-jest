import { globals } from '../../jest.config'
import logger from '../logger'
import { ProductsPage } from '../page/products.page'

beforeAll(async () => {

})

beforeEach(async () => {
  global.context = await global.browser.newContext({
    viewport: {
      width: 1280,
      height: 1024
    },
    recordVideo: {
      dir: global.VIDEO_DIR,
      size: {
        width: 800,
        height: 600
      }
    }
  })

  global.page = await global.context.newPage()

  const userAgent = await page.evaluate(() => navigator.userAgent)
  logger.info(global.chalk.blue(`User agent: ${userAgent}`))

  await page.goto(URL, { waitUntil: 'domcontentloaded' })
  globals.productsPage = await new ProductsPage(page)
})

afterEach(async () => {
  // await global.context.close()
})
