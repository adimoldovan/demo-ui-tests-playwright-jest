const path = require('path')
const fs = require('fs')
const { ContentType } = require('jest-circus-allure-environment')
const { logger } = require('../logger')
const { globals } = require('../../jest.config')

/**
 * Takes a screenshot of the given page
 *
 * @param {page} page Playwright page type
 * @param {string} fileName screenshot file name
 * @param allureReporter
 * @return {Promise<void>}
 */
async function takeScreenshot (page, fileName, allureReporter) {
  try {
    const filePath = path.resolve(globals.SCREENSHOTS_DIR, `${fileName}.png`)

    // Save screenshot
    await page.screenshot({ path: filePath, fullPage: true })
    logger.debug(`Screenshot saved: ${filePath}`)

    // attach to Allure reporter
    if (allureReporter) {
      await allureReporter.attachment(
        fileName,
        fs.readFileSync(filePath),
        ContentType.PNG
      )
    }
  } catch (error) {
    logger.error(`Failed to save screenshot: ${error}`)
  }
}

module.exports = { takeScreenshot }
