import path from 'path'
import { saveVideo } from 'playwright-video'
import { globals } from '../jest.config'
import logger from './logger'
import { ProductsPage } from './page/products.page'

let videoCapture
const video = process.env.VIDEO === 'true'

beforeEach(async () => {
  let userAgent = await page.evaluate(() => navigator.userAgent)

  await jestPlaywright.resetContext({
    userAgent: `E2E-tests ${userAgent}`
  })

  userAgent = await page.evaluate(() => navigator.userAgent)
  logger.info(`User agent: ${userAgent}`)

  if (video) {
    videoCapture = await saveVideo(
      page,
      path.resolve(globals.VIDEO_DIR, `capture_${new Date().getTime()}.mp4`)
    )
  }

  await page.goto(URL, { waitUntil: 'domcontentloaded' })
  // eslint-disable-next-line no-unused-vars
  globals.productsPage = await new ProductsPage(page)
})

afterEach(async () => {
  if (video) {
    await videoCapture.stop()
  }
})
