import { createLogger, transports, format } from 'winston'

const logLevel = 'debug'

export default createLogger({
  transports: [
    new transports.Console({
      level: logLevel,
      format: format.combine(
        format.errors({ stack: true }),
        format.prettyPrint(),
      ),
    }),
  ],
  exceptionHandlers: [
    new transports.Console({
      level: 'error',
      format: format.combine(
        format.errors({ stack: true }),
        format.prettyPrint(),
      ),
    }),
  ],
  exitOnError: false, 
})