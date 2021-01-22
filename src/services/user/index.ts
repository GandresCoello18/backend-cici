import express from 'express';

import { getUser, crerateUser } from './controller';

const router = express.Router();
const baseURL = '/users';

router.get(`${baseURL}/`, getUser);
router.post(`${baseURL}/`, crerateUser);

export default router;
