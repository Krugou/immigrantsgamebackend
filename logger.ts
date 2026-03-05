import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize, json } = format;

const devFormatter = printf(({ level, message, timestamp, ...meta }) => {
  const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `${timestamp} ${level}: ${message}${rest}`;
});

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format:
    process.env.NODE_ENV === 'production'
      ? combine(timestamp(), json())
      : combine(colorize(), timestamp(), devFormatter),
  transports: [new transports.Console()],
});

export default logger;
import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

// ensure the logs directory exists
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// basic log format
const logFormat = winston.format.printf(({ timestamp, level, message, ...meta }) => {
  const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `${timestamp} ${level}: ${message}${metaString}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(winston.format.timestamp(), logFormat),
  transports: [
    // file transport will write to logs/app.log
    new winston.transports.File({ filename: path.join(logDir, 'app.log') }),
    // always also log to console for development
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

// express middleware helper
export function requestLogger(req: Request, _res: Response, next: NextFunction) {
  logger.info(`${req.method} ${req.url}`);
  next();
}

export default logger;
