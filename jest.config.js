process.env.JEST_PLAYWRIGHT_CONFIG = 'jest-playwright.config.js'

const OUTPUT_DIR = 'out'
const REPORTS_DIR = `${OUTPUT_DIR}/reports`
const VIDEO_DIR = `${OUTPUT_DIR}/video`
const LOGS_DIR = `${OUTPUT_DIR}/logs`

module.exports = {
  preset: 'jest-playwright-preset',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.js'],
  globals: {
    URL: 'https://adimoldovan.github.io/demo-shop/#/',
    OUTPUT_DIR: OUTPUT_DIR,
    REPORTS_DIR: REPORTS_DIR,
    VIDEO_DIR: VIDEO_DIR,
    LOGS_DIR: LOGS_DIR
  },

  testMatch: [
    '**/test/**/*.test.js'
  ],
  verbose: true,
  reporters: [
    'default',
    ['jest-junit',
      {
        suiteName: 'E2E Demo Shop tests',
        outputDirectory: REPORTS_DIR,
        outputName: 'junit-results.xml',
        uniqueOutputName: 'true'
      }
    ],
    ['jest-html-reporters', {
      publicPath: './out/reports',
      filename: 'test-report.html',
      expand: true
    }]
  ]
}
