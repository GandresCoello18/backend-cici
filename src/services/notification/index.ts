import express from 'express';
import { auth } from '../../middlewares/auth';

import { addNotification, ReadAllNotification } from './controller';

const router = express.Router();
const baseURL = '/notification';

router.post(`${baseURL}`, auth, addNotification);
router.put(`${baseURL}/readAll`, auth, ReadAllNotification);

export default router;
