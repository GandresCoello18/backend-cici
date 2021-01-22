import express from 'express';

import { getUser } from './controller';

const router = express.Router();
const baseURL = '/users';

router.get(`${baseURL}/`, getUser);

export default router;
