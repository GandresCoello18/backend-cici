import express from 'express';
import { auth } from '../../middlewares/auth';

import { newOrden, getOrdenStatus, getOrders, getOrdersByUser } from './controller';

const router = express.Router();
const baseURL = '/orden';

router.post(`${baseURL}`, auth, newOrden);
router.get(`${baseURL}/status/:status`, auth, getOrdenStatus);
router.get(`${baseURL}`, auth, getOrders);
router.get(`${baseURL}/user/:idUser`, auth, getOrdersByUser);

export default router;
