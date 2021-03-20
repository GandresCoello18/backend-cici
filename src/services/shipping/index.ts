import express from 'express';
import { auth } from '../../middlewares/auth';

import { newShipping, getShipping } from './controller';

const router = express.Router();
const baseURL = '/shipping';

router.post(`${baseURL}`, auth, newShipping);
router.get(`${baseURL}`, auth, getShipping);

export default router;
