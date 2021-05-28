import express from 'express';
import multer from 'multer';
import { auth } from '../../middlewares/auth';
import { storage } from '../../utils/multer';

import {
  getProducts,
  getBestSellersByCategory,
  getProductsCategory,
  getProductsOffers,
  getProductsBestRated,
  getSearchProducts,
  getProduct,
  getReviewProduct,
  createProduct,
  MoreSourcesProduct,
  createReviewProduct,
  deleteProduct,
} from './controller';

const router = express.Router();
const baseURL = '/products';

router.get(`${baseURL}/`, getProducts);
router.get(`${baseURL}/best-sellers-by-category`, getBestSellersByCategory);
router.get(`${baseURL}/category/:idCategory`, getProductsCategory);
router.get(`${baseURL}/offers/:limit`, getProductsOffers);
router.get(`${baseURL}/best-rated/:limit`, getProductsBestRated);
router.get(`${baseURL}/search/:key`, getSearchProducts);
router.get(`${baseURL}/review/:idProduct`, getReviewProduct);
router.get(`${baseURL}/:idProduct`, getProduct);
router.post(
  `${baseURL}/moreSources`,
  auth,
  multer({ storage }).array('more_sources'),
  MoreSourcesProduct,
);
router.post(`${baseURL}/`, auth, multer({ storage }).single('source'), createProduct);
router.post(`${baseURL}/review`, auth, createReviewProduct);
router.delete(`${baseURL}/:idProduct`, auth, deleteProduct);

export default router;
