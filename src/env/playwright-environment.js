const NodeEnvironment = require('jest-environment-node')
const fs = require('fs')
const path = require('path')
const { chromium } = require('playwright')
const os = require('os')

const DIR = path.join(os.tmpdir(), 'jest_playwright_global_setup')

class PlaywrightEnvironment extends NodeEnvironment {
  async setup () {
    await super.setup()
    const wsEndpoint = fs.readFileSync(path.join(DIR, 'wsEndpoint'), 'utf8')
    if (!wsEndpoint) {
      throw new Error('wsEndpoint not found')
    }

    this.global.browser = await chromium.connect({
      wsEndpoint
    })
  }

  async teardown () {
    await super.teardown()
  }

  async handleTestEvent (event) {
    if (event.name === 'test_done' && event.test.errors.length > 0 && this.global.page) {
      const parentName = event.test.parent.name.replace(/\W/g, '-')
      const specName = event.test.name.replace(/\W/g, '-')

      await this.global.page.screenshot({
        path: `${this.global.SCREENSHOTS_DIR}/${parentName}_${specName}.png`
      })
    }

    if (event.name === 'test_done') {
      await this.global.context.close()
    }
  }

  runScript (script) {
    return super.runScript(script)
  }
}

module.exports = PlaywrightEnvironment
