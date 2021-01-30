import express from 'express';
import { auth } from '../../middlewares/auth';

import { getFavoriteProduct, getFavoriteProductCount, createFavorite, deleteFavorite } from './controller';

const router = express.Router();
const baseURL = '/favorite';

router.get(`${baseURL}/:idProduct`, auth, getFavoriteProduct);
router.get(`${baseURL}/count/:idProduct`, getFavoriteProductCount);
router.post(`${baseURL}/`, auth, createFavorite);
router.delete(`${baseURL}/:idProduct`, auth, deleteFavorite);

export default router;
