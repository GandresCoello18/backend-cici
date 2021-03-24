import express from 'express';
import { auth } from '../../middlewares/auth';

import { getProducts, getProductsCategory, getProductsOffers, getProductsBestRated, getProduct, getReviewProduct, createProduct, createReviewProduct, deleteProduct } from './controller';

const router = express.Router();
const baseURL = '/products';

router.get(`${baseURL}/`, getProducts);
router.get(`${baseURL}/category/:idCategory`, getProductsCategory);
router.get(`${baseURL}/offers/:limit`, getProductsOffers);
router.get(`${baseURL}/best-rated/:limit`, getProductsBestRated);
router.get(`${baseURL}/:idProduct`, getProduct);
router.post(`${baseURL}/`, auth, createProduct);
router.post(`${baseURL}/review`, auth, createReviewProduct);
router.get(`${baseURL}/review/:idProduct`, getReviewProduct);
router.delete(`${baseURL}/:idProduct`, deleteProduct);

export default router;
