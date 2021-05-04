import express from 'express';
import { auth } from '../../middlewares/auth';

import { getProductsHistory, createProductHistory, deleteProductHistory } from './controller';

const router = express.Router();
const baseURL = '/products-history';

router.get(`${baseURL}/:limit`, auth, getProductsHistory);
router.post(`${baseURL}`, auth, createProductHistory);
router.delete(`${baseURL}/clear`, auth, deleteProductHistory);

export default router;
