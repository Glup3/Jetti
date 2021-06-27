import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  // defaultMeta: { service: 'your-service-name' },
  transports: [
    // add other transports to file

    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});
