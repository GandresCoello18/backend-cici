import express from 'express';
import cors from 'cors';
import { logger } from './middlewares';
import cloudinary from 'cloudinary';

import User from './services/user';
import Product from './services/product';
import Contact from './services/contact';
import Cart from './services/cart';
import Favorite from './services/favorite';
import Address from './services/addresses';
import Coupons from './services/coupons';
import Orden from './services/orden';
import Shipping from './services/shipping';
import Statistic from './services/statistics';
import Invite from './services/invite';
import TimeMessage from './services/timeMessage';
import Category from './services/category';
import ProductHistory from './services/productHistory';
import Combo from './services/combo';
import TimeOffert from './services/offerTime';
import Notification from './services/notification';
import Lottery from './services/lottery';
import { config } from './utils';
import { CronMidnight } from './utils/cron';
import { ConfigSocketIo } from './utils/socket';

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:8080',
      'https://cici.beauty',
      'https://dashboard.cici.beauty',
    ],
  }),
);

app.use(function (_req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

cloudinary.v2.config({
  cloud_name: config.CLOUD_NAME,
  api_key: config.API_KEY_CLOUDINARY,
  api_secret: config.API_SECRET_CLOUDINARY,
});

app.use('/static', express.static('public'));
app.set('port', config.APP_PORT);

CronMidnight();

// app.use(express.json());
// Use JSON parser for all non-webhook routes

app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhooks/stripe' || req.originalUrl === '/api/v2/stripe/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

export const App = app;

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
  Category,
  ProductHistory,
  Combo,
  TimeOffert,
  Notification,
  Lottery,
]);

const server = app.listen(app.get('port'), () => {
  console.log(`🚀 Server ready at http://localhost:${app.get('port')}`);
});

ConfigSocketIo(server);
