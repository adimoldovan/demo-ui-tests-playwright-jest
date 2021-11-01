const { createLogger, format, transports } = require('winston')
const path = require('path')

let consoleLogLevel = process.env.CONSOLE_LOG_LEVEL || 'debug'

if (process.env.CI) {
  consoleLogLevel = 'error'
}

const stringFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.printf(info => {
    let msg = `${info.timestamp} ${info.level}: ${info.message}`
    if (info.stack) {
      msg = msg + `\n${info.stack}`
    }

    return msg
  }),
  format.uncolorize()
)

// eslint-disable-next-line no-unused-vars
const logger = (module.exports = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.File({
      filename: path.resolve('out/logs', 'e2e-debug.log'),
      format: stringFormat,
      level: 'debug'
    }),

    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.printf(({ level, message, timestamp }) => {
          return `${timestamp} ${level}: ${message}`
        })
      ),
      level: consoleLogLevel
    })
  ]
}))
