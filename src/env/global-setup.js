const { chromium } = require('playwright')
const mkdirp = require('mkdirp')
const path = require('path')
const fs = require('fs')
const os = require('os')

const TMP_DIR = path.join(os.tmpdir(), 'jest_playwright_global_setup')
const { HEADLESS, SLOWMO } = process.env

module.exports = async function () {
  // Launch a browser server that client can connect to
  global.browser = await chromium.launchServer({
    channel: '', // Leave blank for 'chromium'. For stock browsers: 'chrome', 'msedge'. See https://playwright.dev/docs/browsers/
    headless: HEADLESS !== 'false',
    slowMo: parseInt(SLOWMO, 10) || 0,
    devtools: HEADLESS === 'false',
    timeout: 20000
  })
  mkdirp.sync(TMP_DIR)
  fs.writeFileSync(path.join(TMP_DIR, 'wsEndpoint'), global.browser.wsEndpoint())
}
