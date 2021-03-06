import express from 'express';
import { auth } from '../../middlewares/auth';

import {
  newOrden,
  getOrdenStatus,
  getOrdenDetails,
  getOrders,
  getOrdersByUser,
  UpdateStatusOrder,
} from './controller';

const router = express.Router();
const baseURL = '/orden';

router.post(`${baseURL}`, auth, newOrden);
router.get(`${baseURL}/status/:status`, auth, getOrdenStatus);
router.get(`${baseURL}/details/:idOrden`, auth, getOrdenDetails);
router.get(`${baseURL}`, auth, getOrders);
router.get(`${baseURL}/user/:idUser`, auth, getOrdersByUser);
router.put(`${baseURL}/status/:idOrden`, auth, UpdateStatusOrder);

export default router;
