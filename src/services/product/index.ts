import express from 'express';

import { getProducts, getProduct, createProduct } from './controller';

const router = express.Router();
const baseURL = '/products';

router.get(`${baseURL}/`, getProducts);
router.get(`${baseURL}/:idProduct`, getProduct);
router.post(`${baseURL}/`, createProduct);

export default router;
