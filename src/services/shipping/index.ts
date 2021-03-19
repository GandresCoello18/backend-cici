import express from 'express';
import { auth } from '../../middlewares/auth';

import { newShipping } from './controller';

const router = express.Router();
const baseURL = '/shipping';

router.post(`${baseURL}`, auth, newShipping);

export default router;
