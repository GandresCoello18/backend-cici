import express from 'express';
import { auth } from '../../middlewares/auth';

import { getCoupons, createUserCoupons } from './controller';

const router = express.Router();
const baseURL = '/coupons';

router.get(`${baseURL}/`, getCoupons);
router.post(`${baseURL}/assign/user`, auth, createUserCoupons);

export default router;
