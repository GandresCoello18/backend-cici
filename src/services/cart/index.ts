import express from 'express';
import { auth } from '../../middlewares/auth';

import { newProductCart, getProductCart } from './controller';

const router = express.Router();
const baseURL = '/cart';

router.post(`${baseURL}/`, auth, newProductCart);
router.get(`${baseURL}/`, auth, getProductCart);

export default router;
