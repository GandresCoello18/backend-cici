import express from 'express';
import { auth } from '../../middlewares/auth';

import { createOfferTime, AddProductOfferTime, getOfferTimes, deleteOfferTime } from './controller';

const router = express.Router();
const baseURL = '/offerTime';

router.get(`${baseURL}/all`, auth, getOfferTimes);
router.post(`${baseURL}`, auth, createOfferTime);
router.post(`${baseURL}/product`, auth, AddProductOfferTime);
router.delete(`${baseURL}/:idTimeOffer`, auth, deleteOfferTime);


export default router;
