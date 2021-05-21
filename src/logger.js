const { globals } = require('../jest.config')
const path = require('path')

const winston = require('winston')

const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`
})
const defaultFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.cli(),
  customFormat
)

const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  format: defaultFormat,
  transports: [
    new winston.transports.File({
      filename: path.resolve(`${globals.LOGS_DIR}/error.log`),
      level: 'error'
    }),
    new winston.transports.File({
      filename: path.resolve(`${globals.LOGS_DIR}/combined.log`)
    })
  ]
})

if (!process.env.CI) {
  logger.add(new winston.transports.Console({
    format: defaultFormat
  }))
}

module.exports = {
  logger
}
