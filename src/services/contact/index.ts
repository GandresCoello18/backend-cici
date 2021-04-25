import express from 'express';
import { auth } from '../../middlewares/auth';

import { createSms, getSms } from './controller';

const router = express.Router();
const baseURL = '/messages';

router.get(`${baseURL}/`, auth, getSms);
router.post(`${baseURL}/`, createSms);

export default router;
