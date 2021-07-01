const { logger } = require('../logger')
const chalk = require('chalk')
const fs = require('fs')
const { ContentType } = require('jest-circus-allure-environment')
const { ProductsPage } = require('../page/products.page')

beforeEach(async () => {
  global.page = await global.context.newPage()

  page.on('close', async () => {
    if (page.video()) {
      const videoPath = `out/video/${Date.now()}.webm`
      await page.video().saveAs(videoPath)
      await allure.attachment(
        'Video',
        fs.readFileSync(videoPath),
        ContentType.WEBM
      )
    }
  })

  const userAgent = await page.evaluate(() => navigator.userAgent)
  logger.info(chalk.blue(`User agent: ${userAgent}`))

  await page.goto(URL, { waitUntil: 'domcontentloaded' })
  global.productsPage = await new ProductsPage(page)
})
