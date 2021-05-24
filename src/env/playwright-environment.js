const NodeEnvironment = require('jest-environment-node')
const fs = require('fs')
const path = require('path')
const { chromium } = require('playwright')
const os = require('os')
const chalk = require('chalk')
const { logger } = require('../logger')
const { takeScreenshot } = require('../reporter/screenshot')
const AllureNodeEnvironment = require('jest-circus-allure-environment').default

const DIR = path.join(os.tmpdir(), 'pw_global_setup')

class PlaywrightEnvironment extends AllureNodeEnvironment {
  async setup () {
    await super.setup()

    const wsEndpoint = fs.readFileSync(path.join(DIR, 'wsEndpoint'), 'utf8')
    if (!wsEndpoint) {
      throw new Error('wsEndpoint not found')
    }

    this.global.browser = await chromium.connect({
      wsEndpoint
    })

    this.global.context = await this.global.browser.newContext({
      viewport: {
        width: 1280,
        height: 1024
      },
      recordVideo: {
        dir: this.global.VIDEO_DIR,
        size: {
          width: 800,
          height: 600
        }
      }
    })
  }

  async teardown () {
    await super.teardown()
    await this.global.context.close()
  }

  async handleTestEvent (event, state) {
    await super.handleTestEvent(event, state)

    let eventName

    if (event.hook) {
      eventName = `${event.hook.type} - ${event.hook.parent.name}`
    } else if (event.test) {
      eventName = `${event.test.parent.name} - ${event.test.name}`
    } else {
      eventName = event.name
    }

    switch (event.name) {
      case 'hook_failure':
        await this.onFailureEvent(eventName, event.hook.parent.name, event.hook.type, event.error)
        break
      case 'test_fn_failure':
        await this.onFailureEvent(eventName, event.test.parent.name, event.test.name, event.error)
        break
      default:
        break
    }
  }

  async onFailureEvent (eventFullName, parentName, eventName, error) {
    logger.error(chalk.red(`FAILURE: ${error}`))
    await takeScreenshot(this.global.page, eventFullName, this.global.allure)
  }

  runScript (script) {
    return super.runScript(script)
  }
}

module.exports = PlaywrightEnvironment
