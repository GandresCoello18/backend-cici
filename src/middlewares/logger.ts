import { Request, Response, NextFunction } from 'express';
import pino from 'pino';

declare module 'express-serve-static-core' {
  interface Request {
    logger: pino.Logger;
  }
}

let cachedLogger: pino.Logger | null = null;

export function getLogger() {
  if (cachedLogger) {
    // console.log('cached logger retrieved');
    return cachedLogger;
  }

  const logger = pino({ base: null }).child({ env: process.env.ENV, version: '1' });
  cachedLogger = logger;
  // console.log('new logger created');
  return logger;
}

export const logger = async (req: Request, _res: Response, next: NextFunction) => {
  // console.log('logger start');
  const logger = getLogger();
  req.logger = logger;
  next();
};
