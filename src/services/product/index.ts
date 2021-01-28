import express from 'express';

import { getProducts, getProductsCategory, getProductsOffers, getProductsBestRated, getProduct, createProduct } from './controller';

const router = express.Router();
const baseURL = '/products';

router.get(`${baseURL}/`, getProducts);
router.get(`${baseURL}/category/:idCategory`, getProductsCategory);
router.get(`${baseURL}/offers/:limit`, getProductsOffers);
router.get(`${baseURL}/best-rated/:limit`, getProductsBestRated);
router.get(`${baseURL}/:idProduct`, getProduct);
router.post(`${baseURL}/`, createProduct);

export default router;
