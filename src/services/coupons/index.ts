import express from 'express';
import multer from 'multer';
import { auth } from '../../middlewares/auth';
import { storage } from '../../utils/multer';

import {
  getCoupons,
  getCouponsAll,
  getRewardCoupons,
  newCoupon,
  createUserCoupons,
  createRewardCoupons,
  getAssignCoupons,
  getAssignAmountCouponsByUser,
  getUserCoupons,
  updateUserCoupon,
  deleteCoupon,
} from './controller';

const router = express.Router();
const baseURL = '/coupons';

router.get(`${baseURL}/`, getCoupons);
router.get(`${baseURL}/all`, auth, getCouponsAll);
router.get(`${baseURL}/assign/user/:status`, auth, getUserCoupons);
router.get(`${baseURL}/assign/reward`, auth, getRewardCoupons);
router.get(`${baseURL}/assign/amount/:idUser`, auth, getAssignAmountCouponsByUser);
router.get(`${baseURL}/assign`, auth, getAssignCoupons);
router.post(`${baseURL}/`, auth, multer({ storage }).single('source'), newCoupon);
router.post(`${baseURL}/assign/user`, auth, createUserCoupons);
router.post(`${baseURL}/assign/reward`, auth, createRewardCoupons);
router.put(`${baseURL}/assign/user`, auth, updateUserCoupon);
router.delete(`${baseURL}/:idCoupon`, auth, deleteCoupon);

export default router;
