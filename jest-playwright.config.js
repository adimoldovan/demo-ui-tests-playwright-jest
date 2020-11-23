const {HEADLESS, SLOWMO, DEVTOOLS} = process.env;

module.exports = {
    launchOptions: {
        headless: HEADLESS !== 'false',
        slowMo: SLOWMO !== 'false',
        devtools: DEVTOOLS !== 'false'
    }
}