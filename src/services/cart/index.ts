import express from 'express';
import { auth } from '../../middlewares/auth';

import { newProductCart, getProductCart, deleteProductCart } from './controller';

const router = express.Router();
const baseURL = '/cart';

router.post(`${baseURL}/`, auth, newProductCart);
router.get(`${baseURL}/`, auth, getProductCart);
router.delete(`${baseURL}/:idProduct`, auth, deleteProductCart);

export default router;
