import express from 'express';
import { auth } from '../../middlewares/auth';

import { getUser, crerateUser, login } from './controller';

const router = express.Router();
const baseURL = '/users';

router.get(`${baseURL}/me`, auth, getUser);
router.post(`${baseURL}/`, crerateUser);
router.post(`${baseURL}/login`, login);

export default router;
