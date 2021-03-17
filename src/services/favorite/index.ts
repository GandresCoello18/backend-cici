import express from 'express';
import { auth } from '../../middlewares/auth';

import { getFavoriteProduct, getFavoriteByUser, getMyFavoritesProducts, getFavoriteProductCount, createFavorite, deleteFavorite, deleteAllMyFavorites } from './controller';

const router = express.Router();
const baseURL = '/favorite';

router.get(`${baseURL}/user/:idUser`, getFavoriteByUser);
router.get(`${baseURL}/:idProduct`, auth, getFavoriteProduct);
router.get(`${baseURL}/`, auth, getMyFavoritesProducts);
router.get(`${baseURL}/count/:idProduct`, getFavoriteProductCount);
router.post(`${baseURL}/`, auth, createFavorite);
router.delete(`${baseURL}/:idProduct`, auth, deleteFavorite);
router.delete(`${baseURL}/`, auth, deleteAllMyFavorites);

export default router;
