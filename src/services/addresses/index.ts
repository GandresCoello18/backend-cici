import express from 'express';
import { auth } from '../../middlewares/auth';

import { getMyAddress, newAddress } from './controller';

const router = express.Router();
const baseURL = '/favorite';

router.get(`${baseURL}/`, auth, getMyAddress);
router.post(`${baseURL}/`, newAddress);

export default router;
