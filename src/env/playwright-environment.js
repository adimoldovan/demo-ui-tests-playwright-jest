const { chromium } = require('playwright')
const os = require('os')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const logger = require('../logger')
const { ContentType } = require('jest-circus-allure-environment')
const AllureNodeEnvironment = require('jest-circus-allure-environment').default

const TMP_DIR = path.join(os.tmpdir(), 'jest_playwright_global_setup')

class PlaywrightEnvironment extends AllureNodeEnvironment {
  async setup () {
    await super.setup()

    // Connect to server (launched in global-setup)
    const wsEndpoint = fs.readFileSync(path.join(TMP_DIR, 'wsEndpoint'), 'utf8')
    if (!wsEndpoint) {
      throw new Error('wsEndpoint not found')
    }

    this.global.browser = await chromium.connect({
      wsEndpoint
    })

    // new context
    this.global.context = await this.global.browser.newContext({
      recordVideo: {
        dir: 'out/video',
        size: { width: 800, height: 600 }
      },
      viewport: {
        width: 1280,
        height: 1024
      }
    })
    this.global.context.on('page', page => this.onNewPage(page))
  }

  async teardown () {
    await super.teardown()
    await this.global.context.close()
  }

  /**
   * See https://github.com/facebook/jest/blob/main/packages/jest-types/src/Circus.ts
   *
   * @param {Object} event
   * @param {Object} state
   */
  async handleTestEvent (event, state) {
    let eventName

    if (event.hook) {
      eventName = `${event.hook.type} - ${event.hook.parent.name}`
    } else if (event.test) {
      eventName = `${event.test.parent.name} - ${event.test.name}`
    } else {
      eventName = event.name
    }

    switch (event.name) {
      case 'test_start':
        await this.newPage()
        break
      case 'hook_start':
        logger.info(`START: ${eventName}`)
        if (event.hook.type === 'beforeAll') {
          await this.newPage()
        }
        break
      case 'hook_success':
        logger.info(chalk.green(`SUCCESS: ${eventName}`))
        if (event.hook.type === 'beforeAll') {
          await this.closeAllPages(eventName, false)
        }
        break
      case 'hook_failure':
        logger.info(chalk.red(`HOOK FAILED: ${eventName}`))
        await this.onFailure(eventName, event.error)
        if (event.hook.type === 'beforeAll') {
          await this.closeAllPages(eventName, true)
        }
        break
      case 'test_fn_start':
        logger.info(`START TEST: ${eventName}`)
        break
      case 'test_fn_success':
        logger.info(chalk.green(`TEST PASSED: ${eventName}`))
        break
      case 'test_fn_failure':
        logger.info(chalk.red(`FAILED TEST: ${eventName}`))
        await this.onFailure(eventName, event.error)
        break
      case 'test_done':
        await this.closeAllPages(eventName, event.test.errors.length > 0)
        break
      case 'error':
        break
      default:
        break
    }

    await super.handleTestEvent(event, state)
  }

  getVmContext () {
    return super.getVmContext()
  }

  async newPage () {
    this.global.page = await this.global.context.newPage()
  }

  async onNewPage (page) {
    // Observe console logging
    page.on('console', message => {
      const type = message.type()
      const text = message.text()
      logger.debug(`CONSOLE: ${type.toUpperCase()}: ${text}`)
    })

    page.on('pageerror', exception => {
      logger.debug(`Page error: "${exception}"`)
    })

    page.on('requestfailed', request => {
      logger.debug(`Request failed: ${request.url()}  ${request.failure().errorText}`)
    })
  }

  async closeAllPages (eventName, saveVideo = true) {
    for (const page of this.global.context.pages()) {
      await this.closePage(page, eventName, saveVideo)
    }
  }

  async closePage (page, eventName, saveVideo = true) {
    await page.close()

    if (page && saveVideo) {
      await page.waitForTimeout(1)
      const videoName = this.fileNameFormatter(`${eventName}.webm`, true)
      const videoPath = `out/video/${videoName}`

      try {
        await page.video().saveAs(videoPath)
        logger.debug(`Video file saved: ${videoPath}`)
      } catch (error) {
        logger.error(`There was an error saving the video file!\n${error}`)
      }

      try {
        await this.global.allure.attachment(
          videoName,
          fs.readFileSync(videoPath),
          ContentType.WEBM
        )
        logger.debug('Video file attached to report')
      } catch (error) {
        logger.error(`There was an error attaching the video to test report!\n${error}`)
      }
    }
  }

  /**
   * Series of actions to be performed when a failure is detected
   *
   * @param {string} eventFullName the event in which the failure occurred (e.g. test name)
   * @param {Object} error         the error object that triggered the failure
   * @return {Promise<void>}
   */
  async onFailure (eventFullName, error) {
    logger.error(chalk.red(`FAILURE: ${error}`))
    await this.saveScreenshots(eventFullName)
  }

  /**
   * Takes screenshots of all open pages and saves
   *
   * @param {string} fileName screenshot file name
   * @return {Promise<void>}
   */
  async saveScreenshots (fileName) {
    for (const page of this.global.context.pages()) {
      await this.takeScreenshot(page, fileName, this.global.allure)
    }
  }

  async takeScreenshot (page, fileName, allure) {
    let filePath

    try {
      filePath = path.resolve(
          `out/screenshots/${this.fileNameFormatter(fileName)}.png`
      )
      await page.screenshot({ path: filePath, fullPage: true })
      logger.debug(`Screenshot saved: ${filePath}`)

      if (allure) {
        await allure.attachment(fileName, fs.readFileSync(filePath), ContentType.PNG)
      }
    } catch (error) {
      logger.error(`Failed to save screenshot: ${error}`)
    }

    return filePath
  }

  fileNameFormatter (filePath, includeTimestamp = true) {
    const parts = path.parse(path.normalize(filePath))
    let fileName = parts.name
    const ext = parts.ext
    const dirname = parts.dir

    if (includeTimestamp) {
      fileName = `${Date.now()}_${fileName}`
    }

    fileName = fileName.replace(/\W/g, '_')

    return path.join(dirname, `${fileName}${ext}`)
  }
}

module.exports = PlaywrightEnvironment
