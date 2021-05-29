import express from 'express';
import { auth } from '../../middlewares/auth';

import { createCombo, getCombosAll } from './controller';

const router = express.Router();
const baseURL = '/combo';

router.post(`${baseURL}/`, auth, createCombo);
router.get(`${baseURL}/all`, auth, getCombosAll);

export default router;
