import express from 'express';
import { auth } from '../../middlewares/auth';

import { sendInvite } from './controller';

const router = express.Router();
const baseURL = '/invite';

router.post(`${baseURL}/`, auth, sendInvite);

export default router;
