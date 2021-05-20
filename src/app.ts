import express from 'express';
import cors from 'cors';
import { logger } from './middlewares';
import cloudinary from 'cloudinary';

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
import Category from './services/category';
import ProductHistory from './services/productHistory';
import { config } from './utils';
import { CronMidnight } from './utils/cron';
const SocketIo = require('socket.io');

  const app = express();

  app.use(cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:8080',
      'https://cici.beauty',
      'https://dashboard-cici.vercel.app',
    ]
  }));

  app.use(function(_req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  cloudinary.v2.config({
    cloud_name: config.CLOUD_NAME,
    api_key: config.API_KEY_CLOUDINARY,
    api_secret: config.API_SECRET_CLOUDINARY,
  });

  CronMidnight()

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
  app.set("port", config.APP_PORT)

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
  ]);

const server = app.listen(app.get("port"), () => {
  console.log(`🚀 Server ready at http://localhost:${app.get("port")}`);
});

/// SOCKET

interface SocketUser { idSocket: any; userName: string; asign: boolean }

const users: SocketUser[] = [];

const getUser = (idSocket: string) => users.find(user => user.idSocket === idSocket)

const getIndexUser = (idSocket: string) => users.findIndex(user => user.idSocket === idSocket)

const io = SocketIo(server,{cors: {}})

io.on('connection', (socket: any) => {
  console.log('new connection', socket.id)

  if(getUser(socket.id) === undefined){
    users.push({
      idSocket: socket.id,
      userName: 'anonimo',
      asign: false,
    })
  }

  socket.on('new-message', (data: any) => {
    console.log(data)
    const { text, userName } = data

    if(!getUser(socket.id)?.userName && userName){
      users[getIndexUser(socket.id)].userName = userName
    }

    if(!getUser(socket.id)?.asign){
      socket.emit('new-message', {
        text
      })
    }
  })

  io.on('disconnect', function () {
    console.log("Se desonectaron los socket." + socket.id)
  });
})
