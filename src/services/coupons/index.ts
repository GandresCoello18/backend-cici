import express from 'express';

import { getCoupons } from './controller';

const router = express.Router();
const baseURL = '/coupons';

router.get(`${baseURL}/`, getCoupons);

export default router;
