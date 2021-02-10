import express from 'express';
import { auth } from '../../middlewares/auth';

import { newOrden } from './controller';

const router = express.Router();
const baseURL = '/orden';

router.post(`${baseURL}`, auth, newOrden);

export default router;
