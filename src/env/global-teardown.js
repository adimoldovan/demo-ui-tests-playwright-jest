const os = require('os')
const rimraf = require('rimraf')
const path = require('path')

const DIR = path.join(os.tmpdir(), 'pw_global_setup')
module.exports = async function () {
  await global.browser.close()
  rimraf.sync(DIR)
}
