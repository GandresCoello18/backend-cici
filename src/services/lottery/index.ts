import express from 'express';
import { auth } from '../../middlewares/auth';

import { newLottery } from './controller';

const router = express.Router();
const baseURL = '/lottery';

router.post(`${baseURL}/`, auth, newLottery);

export default router;
