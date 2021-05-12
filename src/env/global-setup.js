const { chromium } = require('playwright')
const mkdirp = require('mkdirp')
const path = require('path')
const fs = require('fs')
const os = require('os')

const DIR = path.join(os.tmpdir(), 'pw_global_setup')
const {
  HEADLESS,
  SLOWMO,
  DEVTOOLS
} = process.env

module.exports = async function () {
  // Launch a browser server that client can connect to
  global.browser = await chromium.launchServer({
    headless: HEADLESS !== 'false',
    slowMo: parseInt(SLOWMO) || 0,
    devtools: DEVTOOLS === 'true'
  })
  mkdirp.sync(DIR)
  fs.writeFileSync(path.join(DIR, 'wsEndpoint'), global.browser.wsEndpoint())
}
