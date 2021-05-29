import express from 'express';
import { auth } from '../../middlewares/auth';

import { createCombo } from './controller';

const router = express.Router();
const baseURL = '/combo';

router.post(`${baseURL}/`, auth, createCombo);

export default router;
