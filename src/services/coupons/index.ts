import express from 'express';
import { auth } from '../../middlewares/auth';

import { getCoupons, createUserCoupons, getUserCoupons } from './controller';

const router = express.Router();
const baseURL = '/coupons';

router.get(`${baseURL}/`, getCoupons);
router.get(`${baseURL}/assign/user`, auth, getUserCoupons);
router.post(`${baseURL}/assign/user`, auth, createUserCoupons);

export default router;
