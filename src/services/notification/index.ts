import express from 'express';
import { auth } from '../../middlewares/auth';

import { addNotification } from './controller';

const router = express.Router();
const baseURL = '/notification';

router.post(`${baseURL}`, auth, addNotification);

export default router;
