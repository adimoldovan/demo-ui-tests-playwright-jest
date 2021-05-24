const OUTPUT_DIR = 'out'
const REPORTS_DIR = `${OUTPUT_DIR}/reports`

module.exports = {
  testRunner: 'jest-circus/runner',
  globalSetup: '<rootDir>/src/env/global-setup.js',
  globalTeardown: '<rootDir>/src/env/global-teardown.js',
  setupFilesAfterEnv: ['<rootDir>/src/env/test-setup.js'],
  testEnvironment: '<rootDir>/src/env/playwright-environment.js',
  globals: {
    URL: 'https://adimoldovan.github.io/demo-shop/#/',
    OUTPUT_DIR: OUTPUT_DIR,
    REPORTS_DIR: `${OUTPUT_DIR}/reports`,
    VIDEO_DIR: `${OUTPUT_DIR}/video`,
    LOGS_DIR: `${OUTPUT_DIR}/logs`,
    SCREENSHOTS_DIR: `${OUTPUT_DIR}/screenshots`,
    FAIL_DEMO: process.env.FAIL_DEMO === 'true'
  },
  testEnvironmentOptions: {
    resultsDir: `${OUTPUT_DIR}/allure-results`
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
      publicPath: `${REPORTS_DIR}/html-reporter`,
      filename: 'test-report.html',
      expand: true
    }],
    ['jest-stare', {
      resultDir: `${REPORTS_DIR}/jest-stare`,
      reportTitle: 'jest-stare!'
    }], ['jest-tesults-reporter', {
      'tesults-target': process.env.TESULTS_TOKEN
    }]
  ]
}
