import path from 'path'
import { globals } from '../jest.config'

const winston = require('winston')

const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: path.resolve(`${globals.LOGS_DIR}/error.log`),
      level: 'error'
    }),
    new winston.transports.File({ filename: path.resolve(`${globals.LOGS_DIR}/combined.log`) }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})

export default logger
