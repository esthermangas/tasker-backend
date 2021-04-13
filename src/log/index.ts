import winston from 'winston';
import  morgan from 'morgan';

export const logger = winston.createLogger( {
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console()
  ]
});

const stream = {
  write: (message:any) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')))
  }
};

export const httpLogger =  morgan(
  ':method :url :status :response-time ms - :res[content-length]',
  { stream}
);

