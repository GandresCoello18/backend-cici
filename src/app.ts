import express from 'express';
import cors from 'cors';
import { logger } from './middlewares';

import User from './services/user';
import Product from './services/product';
import Contact from './services/contact'
import Cart from './services/cart'
import Favorite from './services/favorite'
import Address from './services/addresses'
import Coupons from './services/coupons'
import Orden from './services/orden'
import Shipping from './services/shipping';
import Statistic from './services/statistics';
import Invite from './services/invite';
import TimeMessage from './services/timeMessage';

export function init() {
  const app = express();

  app.use(cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:8080'
    ]
  }));

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

  app.use("/static", express.static("public"));

  app.use('/api', logger, [
    User,
    Product,
    Contact,
    Cart,
    Favorite,
    Address,
    Coupons,
    Orden,
    Shipping,
    Statistic,
    Invite,
    TimeMessage,
  ]);

  return { app };
}

if (require.main === module) {
  init().app.listen(9000, () => {
    console.log('🚀 Server ready at http://localhost:9000');
  });
}
