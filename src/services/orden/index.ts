import express from 'express';
import { auth } from '../../middlewares/auth';

import { newOrden, getOrdenStatus, getOrders } from './controller';

const router = express.Router();
const baseURL = '/orden';

router.post(`${baseURL}`, auth, newOrden);
router.get(`${baseURL}/status/:status`, auth, getOrdenStatus);
router.get(`${baseURL}`, auth, getOrders);

export default router;
