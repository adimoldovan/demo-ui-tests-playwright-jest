const { HEADLESS, SLOWMO, DEVTOOLS } = process.env

module.exports = {
  launchOptions: {
    headless: HEADLESS !== 'false',
    slowMo: SLOWMO === 'true',
    devtools: DEVTOOLS === 'true'
  },
  contextOptions: {
    viewport: {
      width: 1280,
      height: 1024
    }
  }
}
