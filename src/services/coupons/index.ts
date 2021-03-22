import express from 'express';
import { auth } from '../../middlewares/auth';

import { getCoupons, createUserCoupons, getAssignCoupons, getAssignAmountCouponsByUser, getUserCoupons, updateUserCoupon } from './controller';

const router = express.Router();
const baseURL = '/coupons';

router.get(`${baseURL}/`, getCoupons);
router.get(`${baseURL}/assign/user/:status`, auth, getUserCoupons);
router.get(`${baseURL}/assign/amount/:idUser`, auth, getAssignAmountCouponsByUser);
router.get(`${baseURL}/assign`, auth, getAssignCoupons);
router.post(`${baseURL}/assign/user`, auth, createUserCoupons);
router.put(`${baseURL}/assign/user`, auth, updateUserCoupon);

export default router;
