import express from 'express';
import { auth } from '../../middlewares/auth';

import { newOrden, getOrdenStatus } from './controller';

const router = express.Router();
const baseURL = '/orden';

router.post(`${baseURL}`, auth, newOrden);
router.get(`${baseURL}/status/:status`, auth, getOrdenStatus);

export default router;
