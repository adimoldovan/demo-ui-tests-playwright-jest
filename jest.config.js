process.env.JEST_PLAYWRIGHT_CONFIG = 'jest-playwright.config.js'

module.exports = {
    "preset": "jest-playwright-preset",
    globals: {
        URL: "https://adimoldovan.github.io/demo-shop/#/"
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
                outputDirectory: "out/reports",
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