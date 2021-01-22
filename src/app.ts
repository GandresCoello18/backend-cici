import express from 'express';
import { config } from './utils';
import cors from 'cors';
import { logger } from './middlewares';

import User from './services/user';

export function init() {
  const app = express();

  const origin: (string | RegExp)[] = [
    'http://localhost:3000',
    'http://localhost:8080'
  ]

  if (config.X_DEBBUGER_ENV === 'development') {
    origin.push(/\.amplifyapp\.com$/);
  }

  app.use(cors({ origin }));

  // app.use(express.json());
  // Use JSON parser for all non-webhook routes
  app.use((req, res, next) => {
    if (
      req.originalUrl === '/api/webhooks/stripe' ||
      req.originalUrl === '/api/v2/stripe/webhook'
    ) {
      next();
    } else {
      express.json()(req, res, next);
    }
  });

  // API version 2
  app.use('/api', logger, [
    User,
  ]);

  return { app };
}

if (require.main === module) {
  init().app.listen(9000, () => {
    console.log('🚀 Server ready at http://localhost:9000');
  });
}
