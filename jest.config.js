process.env.JEST_PLAYWRIGHT_CONFIG = 'jest-playwright.config.js'

const REPORTS_DIR = "out/reports"

module.exports = {
    preset: "jest-playwright-preset",
    setupFilesAfterEnv: ["<rootDir>/src/test-setup.js"],
    globals: {
        URL: "https://adimoldovan.github.io/demo-shop/#/",
        OUTPUT_DIR: "out",
        REPORTS_DIR: REPORTS_DIR,
        VIDEO_DIR: "out/video"
    },

    testMatch: [
        "**/test/**/*.test.js"
    ],
    verbose: true,
    reporters: [
        "default",
        ["jest-junit",
            {
                suiteName: "E2E Demo Shop tests",
                outputDirectory: REPORTS_DIR,
                outputName: "junit-results.xml",
                uniqueOutputName: "true",
            }
        ],
        ["jest-html-reporters", {
            "publicPath": "./out/reports",
            "filename": "test-report.html",
            "expand": true
        }]
    ]
}