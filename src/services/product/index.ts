import express from 'express';

import { getProducts, getProductsCategory, getProductsOffers, getProductsBestRated, getProduct, getReviewProduct, createProduct, createReviewProduct } from './controller';

const router = express.Router();
const baseURL = '/products';

router.get(`${baseURL}/`, getProducts);
router.get(`${baseURL}/category/:idCategory`, getProductsCategory);
router.get(`${baseURL}/offers/:limit`, getProductsOffers);
router.get(`${baseURL}/best-rated/:limit`, getProductsBestRated);
router.get(`${baseURL}/:idProduct`, getProduct);
router.post(`${baseURL}/`, createProduct);
router.post(`${baseURL}/review`, createReviewProduct);
router.get(`${baseURL}/review/:idProduct`, getReviewProduct);

export default router;
